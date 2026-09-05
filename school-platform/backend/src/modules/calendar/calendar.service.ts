import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto, CreateHolidayDto } from './dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(dto: CreateEventDto, schoolId: string, userId: string) {
    return this.prisma.event.create({
      data: {
        schoolId, title: dto.title, startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description, location: dto.location, type: dto.type,
        isPublic: dto.isPublic ?? true, createdBy: userId,
      },
    });
  }

  async findEvents(schoolId: string, from?: string, to?: string) {
    const where: any = { schoolId };
    if (from || to) {
      where.startDate = {};
      if (from) where.startDate.gte = new Date(from);
      if (to) where.startDate.lte = new Date(to);
    }
    return this.prisma.event.findMany({ where, orderBy: { startDate: 'asc' } });
  }

  async updateEvent(id: string, dto: Partial<CreateEventDto>) {
    return this.prisma.event.update({
      where: { id },
      data: { title: dto.title, description: dto.description, location: dto.location, type: dto.type, isPublic: dto.isPublic } as any,
    });
  }

  async deleteEvent(id: string) {
    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted' };
  }

  async createHoliday(dto: CreateHolidayDto, schoolId: string) {
    return this.prisma.schoolHoliday.create({
      data: { schoolId, name: dto.name, date: new Date(dto.date), type: dto.type, description: dto.description },
    });
  }

  async findHolidays(schoolId: string, from?: string, to?: string) {
    const where: any = { schoolId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }
    return this.prisma.schoolHoliday.findMany({ where, orderBy: { date: 'asc' } });
  }

  async deleteHoliday(id: string) {
    await this.prisma.schoolHoliday.delete({ where: { id } });
    return { message: 'Holiday deleted' };
  }
}