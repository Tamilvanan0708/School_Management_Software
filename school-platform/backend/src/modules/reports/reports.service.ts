import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async attendanceByClass(schoolId: string, academicYearId?: string) {
    const classes = await this.prisma.class.findMany({
      where: { schoolId },
      include: { sections: { include: { students: { include: { user: true } } } } },
    });
    return Promise.all(classes.map(async (c) => {
      const allStudentIds = c.sections.flatMap((s) => s.students.map((st) => st.userId));
      if (!allStudentIds.length) return { class: c.name, total: 0, present: 0, percentage: 0 };
      const [total, present] = await Promise.all([
        this.prisma.attendance.count({ where: { userId: { in: allStudentIds }, ...(academicYearId ? { academicYearId } : {}) } }),
        this.prisma.attendance.count({ where: { userId: { in: allStudentIds }, status: 'PRESENT', ...(academicYearId ? { academicYearId } : {}) } }),
      ]);
      return { class: c.name, total, present, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
    }));
  }

  async examPerformance(schoolId: string, examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { schedules: { include: { subject: true, results: true } } },
    });
    if (!exam) return null;
    return {
      exam: exam.name,
      subjects: exam.schedules.map((s) => {
        const marks = s.results.map((r) => r.marksObtained).filter((m): m is number => m != null);
        const avg = marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
        const pass = s.maxMarks ? marks.filter((m) => s.maxMarks && m / s.maxMarks >= 0.35).length : 0;
        return {
          subject: s.subject.name,
          enrolledResults: s.results.length,
          avgPercentage: s.maxMarks ? Math.round((avg / s.maxMarks) * 100) : null,
          passRate: s.results.length ? Math.round((pass / s.results.length) * 100) : 0,
        };
      }),
    };
  }

  async feeCollection(schoolId: string) {
    const now = this.today();
    const structures = await this.prisma.feeStructure.findMany({ where: { schoolId }, include: { payments: true } });
    const monthly: Record<string, { expected: number; collected: number }> = {};
    for (const st of structures) {
      const expected = st.amount * st.payments.length;
      if (expected === 0) continue;
      const collected = st.payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + (p.amountPaid || 0), 0);
      const overdue = st.payments.filter((p) => p.status !== 'PAID' && st.dueDate && st.dueDate < now).length;
      const key = st.academicYearId || 'unassigned';
      monthly[key] ??= { expected: 0, collected: 0 };
      monthly[key].expected += expected;
      monthly[key].collected += collected;
    }
    return { monthly, summary: Object.values(monthly).reduce((acc, m) => ({ expected: acc.expected + m.expected, collected: acc.collected + m.collected }), { expected: 0, collected: 0 }) };
  }

  private today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
}