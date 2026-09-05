import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, teacherId: string) {
    return this.prisma.homework.create({ data: { ...dto, teacherId }, include: { subject: true, section: { include: { class: true } } } });
  }

  async findAll(schoolId: string, filters: any = {}) {
    const where: any = { section: { class: { schoolId } } };
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const [data, total] = await Promise.all([
      this.prisma.homework.findMany({ where, include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.homework.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByStudent(sectionId: string) {
    return this.prisma.homework.findMany({ where: { sectionId }, include: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { dueDate: 'asc' } });
  }

  async findOne(id: string) {
    const hw = await this.prisma.homework.findUnique({ where: { id }, include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: true } } } });
    if (!hw) throw new NotFoundException('Homework not found');
    return hw;
  }

  async update(id: string, dto: any) {
    return this.prisma.homework.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.homework.delete({ where: { id } });
    return { message: 'Homework deleted' };
  }
}