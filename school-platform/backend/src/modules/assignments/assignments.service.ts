import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, teacherId: string) {
    return this.prisma.assignment.create({ data: { ...dto, teacherId }, include: { subject: true, section: { include: { class: true } } } });
  }

  async findAll(schoolId: string, filters: any = {}) {
    const where: any = { section: { class: { schoolId } } };
    if (filters.sectionId) where.sectionId = filters.sectionId;
    const page = Number(filters.page) || 1; const limit = Number(filters.limit) || 20;
    const [data, total] = await Promise.all([
      this.prisma.assignment.findMany({ where, include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: { select: { firstName: true, lastName: true } } } }, _count: { select: { submissions: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.assignment.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByStudent(sectionId: string) {
    return this.prisma.assignment.findMany({ where: { sectionId }, include: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } }, _count: { select: { submissions: true } } }, orderBy: { dueDate: 'asc' } });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id }, include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: true } }, submissions: { include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } } } } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async submit(assignmentId: string, studentId: string, content?: string, attachments?: any) {
    const existing = await this.prisma.assignmentSubmission.findFirst({ where: { assignmentId, studentId } });
    if (existing) return this.prisma.assignmentSubmission.update({ where: { id: existing.id }, data: { content, attachments, status: 'RESUBMITTED', submittedAt: new Date() } });
    return this.prisma.assignmentSubmission.create({ data: { assignmentId, studentId, content, attachments } });
  }

  async grade(submissionId: string, marks: number, feedback?: string) {
    return this.prisma.assignmentSubmission.update({ where: { id: submissionId }, data: { marks, feedback, status: 'GRADED', gradedAt: new Date() } });
  }

  async remove(id: string) {
    await this.prisma.assignment.delete({ where: { id } });
    return { message: 'Assignment deleted' };
  }
}