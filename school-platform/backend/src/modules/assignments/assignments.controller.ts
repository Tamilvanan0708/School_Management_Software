import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post() @Permissions('assignment:create')
  @ApiOperation({ summary: 'Create assignment' })
  create(@Body() dto: any, @CurrentUser() user: any) { return this.assignmentsService.create(dto, user.id); }

  @Get() @Permissions('assignment:view')
  @ApiOperation({ summary: 'List assignments' })
  findAll(@Query() filters: any, @CurrentUser() user: any) { return this.assignmentsService.findAll(user.schoolId, filters); }

  @Get('student/:sectionId') @Permissions('assignment:view')
  @ApiOperation({ summary: 'Get assignments for a student section' })
  findByStudent(@Param('sectionId') sectionId: string) { return this.assignmentsService.findByStudent(sectionId); }

  @Get(':id') @Permissions('assignment:view')
  @ApiOperation({ summary: 'Get assignment by ID' })
  findOne(@Param('id') id: string) { return this.assignmentsService.findOne(id); }

  @Post(':id/submit') @Permissions('assignment:create')
  @ApiOperation({ summary: 'Submit assignment' })
  submit(@Param('id') id: string, @Body() body: { studentId: string; content?: string }) { return this.assignmentsService.submit(id, body.studentId, body.content); }

  @Post('submissions/:id/grade') @Permissions('assignment:edit')
  @ApiOperation({ summary: 'Grade a submission' })
  grade(@Param('id') id: string, @Body() body: { marks: number; feedback?: string }) { return this.assignmentsService.grade(id, body.marks, body.feedback); }

  @Delete(':id') @Permissions('assignment:delete')
  @ApiOperation({ summary: 'Delete assignment' })
  remove(@Param('id') id: string) { return this.assignmentsService.remove(id); }
}