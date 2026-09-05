import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto, TeacherFilterDto } from './dto/teacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeacherDto, schoolId: string) {
    const existing = await this.prisma.teacherProfile.findUnique({ where: { employeeId: dto.employeeId } });
    if (existing) throw new ConflictException('Employee ID already exists');

    const role = await this.prisma.role.findFirst({ where: { schoolId, slug: 'teacher' } });
    if (!role) throw new NotFoundException('Teacher role not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        schoolId, email: dto.email, password: hashedPassword, firstName: dto.firstName, lastName: dto.lastName,
        teacher: { create: { employeeId: dto.employeeId, qualification: dto.qualification, specialization: dto.specialization, address: dto.address, bloodGroup: dto.bloodGroup, gender: dto.gender as any } },
        roles: { create: { roleId: role.id, schoolId } },
      },
      include: { teacher: true },
    });
  }

  async findAll(filters: TeacherFilterDto, schoolId: string) {
    const where: any = { user: { schoolId } };
    if (filters.search) {
      where.OR = [
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { employeeId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const [data, total] = await Promise.all([
      this.prisma.teacherProfile.findMany({ where, include: { user: true }, skip: (page - 1) * limit, take: limit }),
      this.prisma.teacherProfile.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { id },
      include: { user: true, timetables: { include: { subject: true, section: { include: { class: true } } } } },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const existing = await this.prisma.teacherProfile.findUnique({ where: { id }, include: { user: true } });
    if (!existing) throw new NotFoundException('Teacher not found');
    const userData: any = {};
    if (dto.firstName) userData.firstName = dto.firstName;
    if (dto.lastName) userData.lastName = dto.lastName;
    if (Object.keys(userData).length) await this.prisma.user.update({ where: { id: existing.userId }, data: userData });
    return this.prisma.teacherProfile.update({ where: { id }, data: { qualification: dto.qualification, specialization: dto.specialization, address: dto.address, bloodGroup: dto.bloodGroup }, include: { user: true } });
  }

  async remove(id: string) {
    await this.prisma.teacherProfile.delete({ where: { id } });
    return { message: 'Teacher deleted' };
  }
}