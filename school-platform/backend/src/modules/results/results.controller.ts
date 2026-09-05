import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { ResultFilterDto } from './dto/result.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get() @Permissions('result:view')
  @ApiOperation({ summary: 'List results' })
  findAll(@Query() filters: ResultFilterDto, @CurrentUser() user: any) { return this.resultsService.findAll(filters, user.schoolId); }

  @Get('student/:studentId') @Permissions('result:view')
  @ApiOperation({ summary: 'Get student report' })
  getStudentReport(@Param('studentId') studentId: string) { return this.resultsService.getStudentReport(studentId); }

  @Get('report-card/:examId/:studentId') @Permissions('result:view')
  @ApiOperation({ summary: 'Get report card' })
  getReportCard(@Param('examId') examId: string, @Param('studentId') studentId: string) { return this.resultsService.getReportCard(examId, studentId); }
}