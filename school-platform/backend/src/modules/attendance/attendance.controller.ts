import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto, BulkAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post() @Permissions('attendance:create')
  @ApiOperation({ summary: 'Mark attendance for a single student' })
  mark(@Body() dto: MarkAttendanceDto, @CurrentUser() user: any) { return this.attendanceService.mark(dto, user.id); }

  @Post('bulk') @Permissions('attendance:create')
  @ApiOperation({ summary: 'Bulk mark attendance for a section' })
  bulkMark(@Body() dto: BulkAttendanceDto, @CurrentUser() user: any) { return this.attendanceService.bulkMark(dto, user.id); }

  @Get() @Permissions('attendance:view')
  @ApiOperation({ summary: 'List attendance records' })
  findAll(@Query() filters: AttendanceFilterDto, @CurrentUser() user: any) { return this.attendanceService.findAll(filters, user.schoolId); }

  @Get('section/:sectionId') @Permissions('attendance:view')
  @ApiOperation({ summary: 'Get today\'s attendance for a section' })
  getToday(@Param('sectionId') sectionId: string, @Query('date') date: string) { return this.attendanceService.getTodayBySection(sectionId, date || new Date().toISOString().split('T')[0]); }

  @Get('percentage/:userId') @Permissions('attendance:view')
  @ApiOperation({ summary: 'Get attendance percentage for a student' })
  getPercentage(@Param('userId') userId: string, @Query('from') from?: string, @Query('to') to?: string) { return this.attendanceService.getPercentage(userId, from, to); }
}