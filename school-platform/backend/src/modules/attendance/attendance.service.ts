import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MarkAttendanceDto, BulkAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async mark(dto: MarkAttendanceDto, takenBy: string) {
    const existing = await this.prisma.attendance.findFirst({ where: { userId: dto.userId, date: new Date(dto.date) } });
    if (existing) {
      return this.prisma.attendance.update({ where: { id: existing.id }, data: { status: dto.status as any, remarks: dto.remarks } });
    }
    return this.prisma.attendance.create({ data: { userId: dto.userId, sectionId: dto.sectionId, date: new Date(dto.date), status: dto.status as any, takenBy } });
  }

  async bulkMark(dto: BulkAttendanceDto, takenBy: string) {
    const results = [];
    for (const record of dto.records) {
      const existing = await this.prisma.attendance.findFirst({ where: { userId: record.userId, date: new Date(dto.date) } });
      if (existing) {
        results.push(await this.prisma.attendance.update({ where: { id: existing.id }, data: { status: record.status as any, remarks: record.remarks } }));
      } else {
        results.push(await this.prisma.attendance.create({ data: { userId: record.userId, sectionId: dto.sectionId, date: new Date(dto.date), status: record.status as any, takenBy } }));
      }
    }
    return { count: results.length, records: results };
  }

  async findAll(filters: AttendanceFilterDto, schoolId: string) {
    const where: any = { user: { schoolId } };
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.date) where.date = new Date(filters.date);
    if (filters.fromDate || filters.toDate) {
      where.date = {};
      if (filters.fromDate) where.date.gte = new Date(filters.fromDate);
      if (filters.toDate) where.date.lte = new Date(filters.toDate);
    }
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 50;
    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({ where, include: { user: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { date: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.attendance.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getTodayBySection(sectionId: string, date: string) {
    const students = await this.prisma.studentProfile.findMany({ where: { sectionId }, include: { user: { select: { id: true, firstName: true, lastName: true } } } });
    const records = await this.prisma.attendance.findMany({ where: { sectionId, date: new Date(date) } });
    return students.map((s) => ({
      userId: s.userId, firstName: s.user.firstName, lastName: s.user.lastName, admissionNo: s.admissionNo,
      status: records.find((r) => r.userId === s.userId)?.status || null,
      attendanceId: records.find((r) => r.userId === s.userId)?.id || null,
    }));
  }

  async getPercentage(userId: string, fromDate?: string, toDate?: string) {
    const where: any = { userId };
    if (fromDate || toDate) { where.date = {}; if (fromDate) where.date.gte = new Date(fromDate); if (toDate) where.date.lte = new Date(toDate); }
    const total = await this.prisma.attendance.count({ where });
    const present = await this.prisma.attendance.count({ where: { ...where, status: 'PRESENT' } });
    return { total, present, absent: total - present, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  }
}