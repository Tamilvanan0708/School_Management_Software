import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance') @Permissions('report:view')
  @ApiOperation({ summary: 'Attendance report by class' })
  attendance(@CurrentUser() user: any, @Query('academicYearId') academicYearId?: string) {
    return this.reportsService.attendanceByClass(user.schoolId, academicYearId);
  }

  @Get('exam/:examId') @Permissions('report:view')
  @ApiOperation({ summary: 'Exam performance report' })
  exam(@CurrentUser() user: any, @Param('examId') examId: string) { return this.reportsService.examPerformance(user.schoolId, examId); }

  @Get('fees') @Permissions('report:view', 'fee:view')
  @ApiOperation({ summary: 'Fee collection report' })
  fees(@CurrentUser() user: any) { return this.reportsService.feeCollection(user.schoolId); }
}