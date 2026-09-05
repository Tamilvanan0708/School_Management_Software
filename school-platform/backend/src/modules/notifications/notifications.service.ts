import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async createForUsers(userIds: string[], dto: Omit<CreateNotificationDto, 'userId'>) {
    return this.prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, ...dto })),
    });
  }

  async findByUser(userId: string, filters: { page?: number; limit?: number } = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 30;
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);
    return { data, total, unread: data.filter((n) => !n.isRead).length };
  }

  async markRead(id: string, userId: string) {
    const n = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!n) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }
}