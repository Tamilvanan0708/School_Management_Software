import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private todayStart(): Date {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  }

  private dowToday(): number { // 0=Monday .. 6=Sunday
    return (new Date().getDay() + 6) % 7;
  }

  async getToday(user: { id: string; schoolId: string; roles: string[]; permissions: string[] }) {
    if (user.roles.includes('student')) return this.studentToday(user.id);
    if (user.roles.includes('parent')) return this.parentToday(user.id);
    if (user.roles.includes('teacher')) return this.teacherToday(user.id);
    return this.adminToday(user.schoolId);
  }

  private async studentToday(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId }, include: { user: true, section: true, class: true } });
    if (!student) return { role: 'student' };
    const now = this.todayStart();
    const [timetable, homework, assignments, upcomingExams, attTotal, attPresent] = await Promise.all([
      student.sectionId
        ? this.prisma.timetable.findMany({ where: { sectionId: student.sectionId, dayOfWeek: this.dowToday() }, include: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { periodNumber: 'asc' } })
        : Promise.resolve([]),
      student.sectionId
        ? this.prisma.homework.findMany({ where: { sectionId: student.sectionId, dueDate: { gte: now } }, include: { subject: true }, take: 5, orderBy: { dueDate: 'asc' } })
        : Promise.resolve([]),
      student.sectionId
        ? this.prisma.assignment.findMany({ where: { sectionId: student.sectionId, dueDate: { gte: now }, submissions: { none: { studentId: student.id } } }, include: { subject: true }, take: 5, orderBy: { dueDate: 'asc' } })
        : Promise.resolve([]),
      this.prisma.examSchedule.findMany({ where: { date: { gte: now }, exam: { schoolId: student.user.schoolId } }, include: { subject: true, exam: true }, take: 5, orderBy: { date: 'asc' } }),
      this.prisma.attendance.count({ where: { userId } }),
      this.prisma.attendance.count({ where: { userId, status: 'PRESENT' } }),
    ]);
    return {
      role: 'student',
      name: `${student.user.firstName} ${student.user.lastName}`,
      className: student.class?.name, section: student.section?.name,
      todayClasses: timetable.map((t) => ({ period: t.periodNumber, subject: t.subject.name, time: t.startTime, teacher: `${t.teacher.user.firstName} ${t.teacher.user.lastName}` })),
      pendingHomework: homework.map((h) => ({ id: h.id, title: h.title, subject: h.subject.name, dueDate: h.dueDate })),
      pendingAssignments: assignments.map((a) => ({ id: a.id, title: a.title, subject: a.subject.name, dueDate: a.dueDate })),
      upcomingExams: upcomingExams.map((e) => ({ date: e.date, subject: e.subject.name, exam: e.exam.name })),
      attendancePercentage: attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : null,
    };
  }

  private async parentToday(userId: string) {
    const parent = await this.prisma.parentProfile.findUnique({ where: { userId }, include: { children: { include: { child: { include: { user: { select: { id: true, firstName: true, lastName: true } }, class: true, section: true } } } } } });
    if (!parent) return { role: 'parent' };
    const children = [];
    for (const pc of parent.children) {
      const s = await this.studentToday(pc.child.userId);
      const fees = await this.prisma.feePayment.findMany({ where: { studentId: pc.child.id, status: { not: 'PAID' } }, include: { feeStructure: true } });
      children.push({ ...s, childName: `${pc.child.user.firstName} ${pc.child.user.lastName}`, studentId: pc.child.id, pendingFees: fees.reduce((sum, f) => sum + f.feeStructure.amount, 0) });
    }
    return { role: 'parent', children };
  }

  private async teacherToday(userId: string) {
    const teacher = await this.prisma.teacherProfile.findUnique({ where: { userId }, include: { user: true } });
    if (!teacher) return { role: 'teacher' };
    const now = this.todayStart();
    const [timetable, myHomework, pendingSubmissions] = await Promise.all([
      this.prisma.timetable.findMany({ where: { teacherId: teacher.id, dayOfWeek: this.dowToday() }, include: { subject: true, section: { include: { class: true } } }, orderBy: { periodNumber: 'asc' } }),
      this.prisma.homework.findMany({ where: { teacherId: teacher.id, createdAt: { gte: new Date(Date.now() - 7 * 864e5) } }, include: { subject: true, section: { include: { class: true } } }, take: 10, orderBy: { dueDate: 'asc' } }),
      this.prisma.assignment.findMany({
        where: { teacherId: teacher.id, dueDate: { gte: now }, submissions: { some: { NOT: { status: 'GRADED' } } } },
        include: { subject: true, section: { include: { class: true } }, _count: { select: { submissions: true } } }, take: 10, orderBy: { dueDate: 'asc' },
      }),
    ]);
    return {
      role: 'teacher',
      name: `${teacher.user.firstName} ${teacher.user.lastName}`,
      todaySchedule: timetable.map((t) => ({ period: t.periodNumber, subject: t.subject.name, class: `${t.section.class.name}-${t.section.name}` })),
      recentHomework: myHomework.map((h) => ({ title: h.title, subject: h.subject.name, dueDate: h.dueDate })),
      pendingReview: pendingSubmissions.map((a) => ({ assignment: a.title, subject: a.subject.name, submissions: a._count.submissions })),
    };
  }

  private async adminToday(schoolId: string) {
    const now = this.todayStart();
    const [studentCount, teacherCount, leavesPending, fees, recentAnnouncements] = await Promise.all([
      this.prisma.studentProfile.count({ where: { status: 'ACTIVE', user: { schoolId } } }),
      this.prisma.teacherProfile.count({ where: { user: { schoolId } } }),
      this.prisma.leave.count({ where: { status: 'PENDING', user: { schoolId } } }),
      this.feesSummary(schoolId),
      this.prisma.announcement.findMany({ where: { schoolId }, orderBy: { publishDate: 'desc' }, take: 5 }),
    ]);
    const attRecords = await this.prisma.attendance.findMany({ where: { date: now, user: { schoolId } } });
    const marked = attRecords.length;
    const present = attRecords.filter((a) => a.status === 'PRESENT').length;
    return {
      role: 'admin',
      stats: {
        students: studentCount,
        teachers: teacherCount,
        pendingLeaves: leavesPending,
        todayAttendanceMarked: marked,
        todayAttendanceRate: marked > 0 ? Math.round((present / marked) * 100) : 0,
      },
      fees,
      recentAnnouncements: recentAnnouncements.map((a) => ({ title: a.title, date: a.publishDate, pinned: a.isPinned })),
    };
  }

  private async feesSummary(schoolId: string) {
    const structures = await this.prisma.feeStructure.findMany({ where: { schoolId }, include: { payments: true } });
    let expectedTotal = 0, collected = 0;
    for (const st of structures) {
      for (const p of st.payments) {
        expectedTotal += st.amount;
        if (p.status === 'PAID') collected += p.amountPaid || st.amount;
      }
    }
    return { expectedTotal, collected, percentage: expectedTotal > 0 ? Math.round((collected / expectedTotal) * 100) : 0 };
  }
}