import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}

  getSchool(schoolId: string) {
    return this.prisma.school.findUnique({ where: { id: schoolId } });
  }

  updateSchool(schoolId: string, dto: any) {
    return this.prisma.school.update({ where: { id: schoolId }, data: dto });
  }

  academicYears(schoolId: string) {
    return this.prisma.academicYear.findMany({ where: { schoolId }, orderBy: { startDate: 'desc' } });
  }

  async createAcademicYear(schoolId: string, dto: { name: string; startDate: string; endDate: string; isCurrent?: boolean }) {
    if (dto.isCurrent) await this.prisma.academicYear.updateMany({ where: { schoolId }, data: { isCurrent: false } });
    return this.prisma.academicYear.create({
      data: { schoolId, name: dto.name, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate), isCurrent: dto.isCurrent ?? false },
    });
  }

  async setCurrentYear(id: string) {
    const ay = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!ay) throw new NotFoundException('Academic year not found');
    await this.prisma.academicYear.updateMany({ where: { schoolId: ay.schoolId }, data: { isCurrent: false } });
    return this.prisma.academicYear.update({ where: { id }, data: { isCurrent: true } });
  }

  users(schoolId: string, roleSlug?: string) {
    return this.prisma.user.findMany({
      where: { schoolId, ...(roleSlug ? { roles: { some: { role: { slug: roleSlug } } } } : {}) },
      include: { roles: { include: { role: true } }, student: { include: { class: true, section: true } }, teacher: true },
      orderBy: { firstName: 'asc' },
    });
  }
}