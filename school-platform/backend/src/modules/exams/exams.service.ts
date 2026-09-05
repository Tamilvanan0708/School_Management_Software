import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.exam.create({ data: dto, include: { schedules: true } });
  }

  async findAll(schoolId: string) {
    return this.prisma.exam.findMany({ where: { schoolId }, include: { _count: { select: { schedules: true } } }, orderBy: { startDate: 'desc' } });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id }, include: { schedules: { include: { subject: true, results: { include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } } } } } } });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async addSchedule(examId: string, dto: any) {
    return this.prisma.examSchedule.create({ data: { ...dto, examId }, include: { subject: true } });
  }

  async enterMarks(scheduleId: string, marks: Array<{ studentId: string; marksObtained: number; grade?: string }>) {
    const results = [];
    for (const m of marks) {
      results.push(await this.prisma.examResult.upsert({
        where: { examScheduleId_studentId: { examScheduleId: scheduleId, studentId: m.studentId } },
        update: { marksObtained: m.marksObtained, grade: m.grade },
        create: { examScheduleId: scheduleId, studentId: m.studentId, marksObtained: m.marksObtained, grade: m.grade },
      }));
    }
    return { count: results.length };
  }
}