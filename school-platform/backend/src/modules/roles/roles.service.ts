import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  listRoles(schoolId: string) {
    return this.prisma.role.findMany({
      where: { schoolId },
      include: { permissions: { include: { permission: true } }, _count: { select: { userRoles: true } } },
      orderBy: { hierarchy: 'desc' },
    });
  }

  listPermissions(schoolId: string) {
    return this.prisma.permission.findMany({ where: { schoolId }, orderBy: [{ resource: 'asc' }, { action: 'asc' }] });
  }

  createRole(schoolId: string, dto: { name: string; slug: string; hierarchy: number; description?: string }) {
    return this.prisma.role.create({ data: { schoolId, name: dto.name, slug: dto.slug, hierarchy: dto.hierarchy, description: dto.description } });
  }

  async setRolePermissions(roleId: string, permissionIds: string[]) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    if (permissionIds.length) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((pid) => ({ roleId, permissionId: pid, isAllowed: true })),
      });
    }
    return this.prisma.role.findUnique({ where: { id: roleId }, include: { permissions: { include: { permission: true } } } });
  }

  async setUserRole(userId: string, roleId: string, schoolId: string) {
    await this.prisma.userRole.deleteMany({ where: { userId } });
    return this.prisma.userRole.create({ data: { userId, roleId, schoolId }, include: { role: true } });
  }
}