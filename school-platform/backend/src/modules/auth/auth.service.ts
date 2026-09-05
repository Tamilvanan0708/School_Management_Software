import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');

    const roles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    const permissions = roles.flatMap((r) =>
      r.role.permissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`),
    );

    const payload = {
      sub: user.id,
      schoolId: user.schoolId,
      roles: roles.map((r) => r.role.slug),
      permissions: [...new Set(permissions)],
    };

    return { accessToken: this.jwtService.sign(payload), user };
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string; schoolId: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        schoolId: data.schoolId,
      },
    });
  }
}