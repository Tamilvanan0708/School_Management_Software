import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResultFilterDto } from './dto/result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ResultFilterDto, schoolId: string) {
    const where: any = { examSchedule: { exam: { schoolId } } };
    if (filters.examId) where.examSchedule = { examId: filters.examId };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.sectionId) where.student = { sectionId: filters.sectionId };

    return this.prisma.examResult.findMany({
      where,
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
        examSchedule: { include: { subject: true, exam: true } },
      },
      orderBy: { examSchedule: { date: 'desc' } },
    });
  }

  async getStudentReport(studentId: string) {
    return this.prisma.examResult.findMany({
      where: { studentId },
      include: { examSchedule: { include: { subject: true, exam: true } } },
      orderBy: { examSchedule: { date: 'desc' } },
    });
  }

  async getReportCard(examId: string, studentId: string) {
    const results = await this.prisma.examResult.findMany({
      where: { examSchedule: { examId }, studentId },
      include: { examSchedule: { include: { subject: true } } },
    });
    const totalMarks = results.reduce((sum, r) => sum + (r.marksObtained || 0), 0);
    const maxMarks = results.reduce((sum, r) => sum + (r.examSchedule.maxMarks || 0), 0);
    const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
    return { results, totalMarks, maxMarks, percentage, grade: percentage >= 90 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : percentage >= 45 ? 'C' : 'D' };
  }
}