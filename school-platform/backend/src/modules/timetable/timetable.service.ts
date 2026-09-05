import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimetableEntryDto, BulkTimetableDto } from './dto/timetable.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimetableEntryDto) {
    const conflict = await this.prisma.timetable.findFirst({
      where: { teacherId: dto.teacherId, dayOfWeek: dto.dayOfWeek, periodNumber: dto.periodNumber },
    });
    if (conflict) throw new ConflictException('Teacher already has a class in this period');
    return this.prisma.timetable.create({ data: dto, include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: true } } } });
  }

  async bulkCreate(dto: BulkTimetableDto) {
    const results = [];
    for (const entry of dto.entries) {
      const conflict = await this.prisma.timetable.findFirst({ where: { teacherId: entry.teacherId, dayOfWeek: entry.dayOfWeek, periodNumber: entry.periodNumber } });
      if (!conflict) results.push(await this.prisma.timetable.create({ data: entry }));
    }
    return { created: results.length };
  }

  async getBySection(sectionId: string) {
    return this.prisma.timetable.findMany({ where: { sectionId }, include: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }] });
  }

  async getByTeacher(teacherId: string) {
    return this.prisma.timetable.findMany({ where: { teacherId }, include: { subject: true, section: { include: { class: true } } }, orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }] });
  }

  async remove(id: string) {
    await this.prisma.timetable.delete({ where: { id } });
    return { message: 'Timetable entry deleted' };
  }
}