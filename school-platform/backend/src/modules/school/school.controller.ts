import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('School')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get() @Permissions('announcement:view')
  @ApiOperation({ summary: 'Current school profile' })
  getSchool(@CurrentUser() user: any) { return this.schoolService.getSchool(user.schoolId); }

  @Patch() @Permissions('settings:edit')
  @ApiOperation({ summary: 'Update school profile/settings' })
  update(@CurrentUser() user: any, @Body() dto: any) { return this.schoolService.updateSchool(user.schoolId, dto); }

  @Get('academic-years') @Permissions('class:view')
  academicYears(@CurrentUser() user: any) { return this.schoolService.academicYears(user.schoolId); }

  @Post('academic-years') @Permissions('class:create')
  createYear(@CurrentUser() user: any, @Body() dto: any) { return this.schoolService.createAcademicYear(user.schoolId, dto); }

  @Post('academic-years/:id/current') @Permissions('class:edit')
  @ApiOperation({ summary: 'Mark an academic year as current' })
  setCurrent(@Param('id') id: string) { return this.schoolService.setCurrentYear(id); }

  @Get('users') @Permissions('user:view')
  @ApiOperation({ summary: 'Staff directory (filter by role slug)' })
  users(@CurrentUser() user: any, @Query('role') role?: string) { return this.schoolService.users(user.schoolId, role); }
}