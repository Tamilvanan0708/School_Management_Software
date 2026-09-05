import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post() @Permissions('exam:create')
  @ApiOperation({ summary: 'Create exam' })
  create(@Body() dto: any) { return this.examsService.create(dto); }

  @Get() @Permissions('exam:view')
  @ApiOperation({ summary: 'List exams' })
  findAll(@CurrentUser() user: any) { return this.examsService.findAll(user.schoolId); }

  @Get(':id') @Permissions('exam:view')
  @ApiOperation({ summary: 'Get exam by ID' })
  findOne(@Param('id') id: string) { return this.examsService.findOne(id); }

  @Post(':id/schedules') @Permissions('exam:edit')
  @ApiOperation({ summary: 'Add schedule to exam' })
  addSchedule(@Param('id') id: string, @Body() dto: any) { return this.examsService.addSchedule(id, dto); }

  @Post('schedules/:id/marks') @Permissions('result:create')
  @ApiOperation({ summary: 'Enter marks for exam schedule' })
  enterMarks(@Param('id') id: string, @Body() body: { marks: Array<{ studentId: string; marksObtained: number; grade?: string }> }) { return this.examsService.enterMarks(id, body.marks); }
}