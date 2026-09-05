import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveDto, ApproveLeaveDto } from './dto/leave.dto';

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeaveDto, userId: string) {
    return this.prisma.leave.create({
      data: {
        userId, leaveType: dto.leaveType,
        startDate: new Date(dto.startDate), endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.leave.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findAll(schoolId: string, status?: string) {
    const where: any = { user: { schoolId } };
    if (status) where.status = status as any;
    return this.prisma.leave.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async approve(id: string, dto: ApproveLeaveDto, approverId: string) {
    const leave = await this.prisma.leave.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('Leave request not found');
    return this.prisma.leave.update({
      where: { id },
      data: { status: dto.status as any, approvedBy: approverId, approverRemarks: dto.remarks },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }
}