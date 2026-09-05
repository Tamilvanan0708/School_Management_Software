import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/communication.dto';

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  async send(dto: SendMessageDto, senderId: string) {
    const receiver = await this.prisma.user.findUnique({ where: { id: dto.receiverId } });
    if (!receiver) throw new NotFoundException('Receiver not found');
    return this.prisma.communication.create({
      data: {
        senderId, receiverId: dto.receiverId, subject: dto.subject, message: dto.message, parentId: dto.parentId,
      },
      include: { sender: { select: { firstName: true, lastName: true } }, receiver: { select: { firstName: true, lastName: true } } },
    });
  }

  async getThreads(userId: string) {
    const messages = await this.prisma.communication.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: { sender: { select: { id: true, firstName: true, lastName: true } }, receiver: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { sentAt: 'asc' },
    });

    const threads = new Map<string, any>();
    for (const m of messages) {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId;
      if (!threads.has(otherId)) {
        threads.set(otherId, { otherUser: m.senderId === userId ? m.receiver : m.sender, messages: [] });
      }
      const thread = threads.get(otherId);
      thread.messages.push(m);
    }

    return Array.from(threads.values()).sort(
      (a, b) => b.messages[b.messages.length - 1].sentAt.getTime() - a.messages[a.messages.length - 1].sentAt.getTime(),
    );
  }

  async getThread(userId: string, otherId: string) {
    return this.prisma.communication.findMany({
      where: {
        OR: [{ senderId: userId, receiverId: otherId }, { senderId: otherId, receiverId: userId }],
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { sentAt: 'asc' },
    });
  }

  async markThreadRead(userId: string, otherId: string) {
    return this.prisma.communication.updateMany({
      where: { receiverId: userId, senderId: otherId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.communication.count({ where: { receiverId: userId, isRead: false } });
  }
}