import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createParent(dto: { email: string; password: string; firstName: string; lastName: string; phone?: string; occupation?: string; address?: string }, schoolId: string) {
    const existing = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    const role = await this.prisma.role.findFirst({ where: { schoolId, slug: 'parent' } });
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        schoolId, email: dto.email, password: hashed, firstName: dto.firstName, lastName: dto.lastName, phone: dto.phone,
        parent: { create: { occupation: dto.occupation, address: dto.address, primaryContact: dto.phone } },
        roles: role ? { create: { roleId: role.id, schoolId } } : undefined,
      },
      include: { parent: true },
    });
  }

  async linkChild(dto: { parentUserId: string; studentId: string; relationship?: string }) {
    const parent = await this.prisma.parentProfile.findUnique({ where: { userId: dto.parentUserId } });
    if (!parent) throw new NotFoundException('Parent profile not found');
    const student = await this.prisma.studentProfile.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');
    const existing = await this.prisma.parentChild.findFirst({ where: { parentId: parent.id, childId: student.id } });
    if (existing) throw new ConflictException('Already linked');
    return this.prisma.parentChild.create({ data: { parentId: parent.id, childId: student.id, relationship: dto.relationship || 'guardian' } });
  }

  async unlinkChild(dto: { parentUserId: string; studentId: string }) {
    const parent = await this.prisma.parentProfile.findUnique({ where: { userId: dto.parentUserId } });
    if (!parent) return { removed: 0 };
    return this.prisma.parentChild.deleteMany({ where: { parentId: parent.id, childId: dto.studentId } });
  }

  async childrenOf(parentUserId: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId: parentUserId },
      include: { children: { include: { child: { include: { user: { select: { firstName: true, lastName: true } }, class: true, section: true } } } } },
    });
    if (!parent) return [];
    return parent.children.map((c) => ({
      studentId: c.child.id,
      name: `${c.child.user.firstName} ${c.child.user.lastName}`,
      className: c.child.class?.name,
      section: c.child.section?.name,
      relationship: c.relationship,
    }));
  }
}