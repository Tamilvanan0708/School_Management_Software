import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import { CreateTimetableEntryDto, BulkTimetableDto } from './dto/timetable.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Timetable')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post() @Permissions('timetable:create')
  @ApiOperation({ summary: 'Create timetable entry' })
  create(@Body() dto: CreateTimetableEntryDto) { return this.timetableService.create(dto); }

  @Post('bulk') @Permissions('timetable:create')
  @ApiOperation({ summary: 'Bulk create timetable entries' })
  bulkCreate(@Body() dto: BulkTimetableDto) { return this.timetableService.bulkCreate(dto); }

  @Get('section/:sectionId') @Permissions('timetable:view')
  @ApiOperation({ summary: 'Get timetable by section' })
  getBySection(@Param('sectionId') sectionId: string) { return this.timetableService.getBySection(sectionId); }

  @Get('teacher/:teacherId') @Permissions('timetable:view')
  @ApiOperation({ summary: 'Get timetable by teacher' })
  getByTeacher(@Param('teacherId') teacherId: string) { return this.timetableService.getByTeacher(teacherId); }

  @Delete(':id') @Permissions('timetable:create')
  @ApiOperation({ summary: 'Delete timetable entry' })
  remove(@Param('id') id: string) { return this.timetableService.remove(id); }
}