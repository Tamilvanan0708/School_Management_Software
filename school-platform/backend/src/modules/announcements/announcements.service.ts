import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto, user: { schoolId: string; id: string }) {
    return this.prisma.announcement.create({
      data: {
        schoolId: user.schoolId,
        title: dto.title,
        content: dto.content,
        type: dto.type,
        targetRoles: dto.targetRoles as any,
        targetClasses: dto.targetClasses as any,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isPinned: dto.isPinned ?? false,
        publishedBy: user.id,
      },
      include: { school: true },
    });
  }

  async findAll(schoolId: string, filters: any = {}) {
    const where: any = { schoolId };
    if (filters.type) where.type = filters.type;

    const userRoles: string[] = filters.userRoles ? (typeof filters.userRoles === 'string' ? JSON.parse(filters.userRoles) : filters.userRoles) : [];
    const userClassIds: string[] = filters.userClassIds ? (typeof filters.userClassIds === 'string' ? JSON.parse(filters.userClassIds) : filters.userClassIds) : [];

    const base = await this.prisma.announcement.findMany({
      where,
      include: { school: true },
      orderBy: [{ isPinned: 'desc' }, { publishDate: 'desc' }],
    });

    if (userRoles.length === 0 && userClassIds.length === 0) return base;

    return base.filter((a) => {
      const targets = (a.targetRoles as string[]) || [];
      const classTargets = (a.targetClasses as string[]) || [];
      if (targets.length === 0 && classTargets.length === 0) return true;
      const roleOk = targets.length > 0 && (targets as any[]).some((t: any) => userRoles.includes(typeof t === 'string' ? t : t.slug || t.role));
      const classOk = classTargets.length > 0 && (classTargets as any[]).some((t: any) => userClassIds.includes(typeof t === 'string' ? t : t.id || t.classId));
      return roleOk || classOk;
    });
  }

  async findOne(id: string) {
    const a = await this.prisma.announcement.findUnique({ where: { id }, include: { school: true } });
    if (!a) throw new NotFoundException('Announcement not found');
    return a;
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data: {
        title: dto.title, content: dto.content,
        targetRoles: dto.targetRoles as any, targetClasses: dto.targetClasses as any,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isPinned: dto.isPinned,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.announcement.delete({ where: { id } });
    return { message: 'Announcement deleted' };
  }
}