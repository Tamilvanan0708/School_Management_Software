import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto, StudentFilterDto } from './dto/student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto, schoolId: string) {
    const existing = await this.prisma.studentProfile.findUnique({ where: { admissionNo: dto.admissionNo } });
    if (existing) throw new ConflictException('Admission number already exists');

    const role = await this.prisma.role.findFirst({ where: { schoolId, slug: 'student' } });
    if (!role) throw new NotFoundException('Student role not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        schoolId,
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        student: {
          create: {
            admissionNo: dto.admissionNo,
            rollNo: dto.rollNo,
            classId: dto.classId,
            sectionId: dto.sectionId,
            gender: dto.gender as any,
            dob: dto.dob ? new Date(dto.dob) : undefined,
            guardianName: dto.guardianName,
            guardianPhone: dto.guardianPhone,
            address: dto.address,
            bloodGroup: dto.bloodGroup,
          },
        },
        roles: { create: { roleId: role.id, schoolId } },
      },
      include: { student: { include: { class: true, section: true } } },
    });

    return user;
  }

  async findAll(filters: StudentFilterDto, schoolId: string) {
    const where: any = { user: { schoolId } };
    if (filters.classId) where.classId = filters.classId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { admissionNo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.studentProfile.findMany({
        where,
        include: { user: true, class: true, section: true },
        skip,
        take: limit,
        orderBy: filters.sortBy ? { [filters.sortBy]: filters.sortOrder || 'asc' } : { admissionNo: 'asc' },
      }),
      this.prisma.studentProfile.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: true,
        class: true,
        section: true,
        academicYear: true,
        parentChildren: { include: { parent: { include: { user: true } } } },
        examResults: { include: { examSchedule: { include: { exam: true, subject: true } } } },
        feePayments: true,
        assignmentSubmissions: { include: { assignment: true } },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    const existing = await this.prisma.studentProfile.findUnique({ where: { id }, include: { user: true } });
    if (!existing) throw new NotFoundException('Student not found');

    const userData: any = {};
    if (dto.firstName) userData.firstName = dto.firstName;
    if (dto.lastName) userData.lastName = dto.lastName;
    if (Object.keys(userData).length) {
      await this.prisma.user.update({ where: { id: existing.userId }, data: userData });
    }

    const profileData: any = {};
    if (dto.rollNo !== undefined) profileData.rollNo = dto.rollNo;
    if (dto.classId) profileData.classId = dto.classId;
    if (dto.sectionId !== undefined) profileData.sectionId = dto.sectionId;
    if (dto.gender) profileData.gender = dto.gender;
    if (dto.dob) profileData.dob = new Date(dto.dob);
    if (dto.guardianName !== undefined) profileData.guardianName = dto.guardianName;
    if (dto.guardianPhone !== undefined) profileData.guardianPhone = dto.guardianPhone;
    if (dto.address !== undefined) profileData.address = dto.address;
    if (dto.bloodGroup !== undefined) profileData.bloodGroup = dto.bloodGroup;
    if (dto.status) profileData.status = dto.status;

    if (Object.keys(profileData).length) {
      return this.prisma.studentProfile.update({
        where: { id },
        data: profileData,
        include: { user: true, class: true, section: true },
      });
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    await this.prisma.studentProfile.update({ where: { id }, data: { status: 'INACTIVE' } });
    return { message: 'Student deactivated' };
  }

  async getStudentByUserId(userId: string) {
    return this.prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true, class: { include: { sections: true } }, section: true, academicYear: true },
    });
  }
}