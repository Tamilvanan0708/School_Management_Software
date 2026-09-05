import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto, ApproveLeaveDto } from './dto/leave.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post() @Permissions('leave:create')
  @ApiOperation({ summary: 'Apply for leave' })
  create(@Body() dto: CreateLeaveDto, @CurrentUser() user: any) {
    return this.leavesService.create(dto, user.id);
  }

  @Get('mine') @Permissions('leave:view')
  @ApiOperation({ summary: 'List my leave requests' })
  findMine(@CurrentUser() user: any) { return this.leavesService.findByUser(user.id); }

  @Get() @Permissions('leave:view')
  @ApiOperation({ summary: 'List all leave requests (pending approved with leave approve permission)' })
  findAll(@Query('status') status: string | undefined, @CurrentUser() user: any) {
    return this.leavesService.findAll(user.schoolId, status);
  }

  @Post(':id/approve') @Permissions('leave:approve')
  @ApiOperation({ summary: 'Approve or reject a leave request' })
  approve(@Param('id') id: string, @Body() dto: ApproveLeaveDto, @CurrentUser() user: any) {
    return this.leavesService.approve(id, dto, user.id);
  }
}