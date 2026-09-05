import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  private uploadDir() {
    const dir = join(process.cwd(), 'uploads');
    mkdirSync(dir, { recursive: true });
    return dir;
  }

  async uploadMeta(dto: { sectionId: string; subjectId: string; title: string; description?: string; type?: string }, userId: string) {
    const asTeacher = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    const m = await this.prisma.studyMaterial.create({
      data: { sectionId: dto.sectionId, subjectId: dto.subjectId, teacherId: asTeacher?.id ?? null, title: dto.title, description: dto.description, type: dto.type || 'document' },
      include: { subject: true, section: true },
    });
    return { id: m.id, uploadUrl: `/api/v1/materials/${m.id}/file` };
  }

  async uploadFile(id: string, file: { originalname: string; buffer: Buffer; mimetype: string }) {
    const m = await this.prisma.studyMaterial.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Material not found');
    const ext = extname(file.originalname) || '';
    const fname = `${createHash('md5').update(file.originalname + id).digest('hex').slice(0, 12)}${ext}`;
    const { writeFileSync } = require('fs');
    writeFileSync(join(this.uploadDir(), fname), file.buffer);
    return this.prisma.studyMaterial.update({ where: { id }, data: { fileUrl: `/uploads/${fname}` } });
  }

  async list(schoolId: string, filters: { sectionId?: string; subjectId?: string } = {}) {
    const where: any = { subject: { schoolId } };
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    return this.prisma.studyMaterial.findMany({
      where,
      include: { subject: true, section: { include: { class: true } }, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { uploadedAt: 'desc' },
      take: 100,
    });
  }

  async remove(id: string) {
    await this.prisma.studyMaterial.delete({ where: { id } });
    return { message: 'Material deleted' };
  }
}