import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSubjectDto, schoolId: string) {
    return this.prisma.subject.create({ data: { schoolId, name: dto.name, code: dto.code, type: dto.type, credits: dto.credits } });
  }

  findAll(schoolId: string) {
    return this.prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' }, include: { _count: { select: { timetables: true, homework: true } } } });
  }

  async findOne(id: string) {
    const s = await this.prisma.subject.findUnique({ where: { id }, include: { timetables: { include: { section: { include: { class: true } }, teacher: { include: { user: true } } } }, materials: true } });
    if (!s) throw new NotFoundException('Subject not found');
    return s;
  }

  update(id: string, dto: UpdateSubjectDto) {
    return this.prisma.subject.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.subject.delete({ where: { id } });
    return { message: 'Subject deleted' };
  }
}