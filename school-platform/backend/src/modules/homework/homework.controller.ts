import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Homework')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post() @Permissions('homework:create')
  @ApiOperation({ summary: 'Create homework' })
  create(@Body() dto: any, @CurrentUser() user: any) { return this.homeworkService.create(dto, user.id); }

  @Get() @Permissions('homework:view')
  @ApiOperation({ summary: 'List homework' })
  findAll(@Query() filters: any, @CurrentUser() user: any) { return this.homeworkService.findAll(user.schoolId, filters); }

  @Get('student/:sectionId') @Permissions('homework:view')
  @ApiOperation({ summary: 'Get homework for a student section' })
  findByStudent(@Param('sectionId') sectionId: string) { return this.homeworkService.findByStudent(sectionId); }

  @Get(':id') @Permissions('homework:view')
  @ApiOperation({ summary: 'Get homework by ID' })
  findOne(@Param('id') id: string) { return this.homeworkService.findOne(id); }

  @Patch(':id') @Permissions('homework:edit')
  @ApiOperation({ summary: 'Update homework' })
  update(@Param('id') id: string, @Body() dto: any) { return this.homeworkService.update(id, dto); }

  @Delete(':id') @Permissions('homework:delete')
  @ApiOperation({ summary: 'Delete homework' })
  remove(@Param('id') id: string) { return this.homeworkService.remove(id); }
}