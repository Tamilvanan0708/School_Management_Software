import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto, UpdateClassDto, CreateSectionDto } from './dto/class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassDto, schoolId: string) {
    return this.prisma.class.create({ data: { schoolId, name: dto.name, code: dto.code }, include: { sections: true } });
  }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({ where: { schoolId }, include: { sections: { include: { _count: { select: { students: true } } } }, _count: { select: { sections: true } } }, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const cls = await this.prisma.class.findUnique({ where: { id }, include: { sections: { include: { _count: { select: { students: true } } } }, school: true } });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async update(id: string, dto: UpdateClassDto) {
    return this.prisma.class.update({ where: { id }, data: dto, include: { sections: true } });
  }

  async remove(id: string) {
    await this.prisma.class.delete({ where: { id } });
    return { message: 'Class deleted' };
  }

  async addSection(classId: string, dto: CreateSectionDto) {
    const cls = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!cls) throw new NotFoundException('Class not found');
    return this.prisma.section.create({ data: { classId, name: dto.name, capacity: dto.capacity } });
  }

  async removeSection(id: string) {
    await this.prisma.section.delete({ where: { id } });
    return { message: 'Section deleted' };
  }
}