import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post() @Permissions('announcement:create')
  @ApiOperation({ summary: 'Create announcement' })
  create(@Body() dto: CreateAnnouncementDto, @CurrentUser() user: any) { return this.announcementsService.create(dto, user); }

  @Get() @Permissions('announcement:view')
  @ApiOperation({ summary: 'List announcements (filtered by role/class target for students/parents)' })
  findAll(@Query() filters: any, @CurrentUser() user: any) { return this.announcementsService.findAll(user.schoolId, { ...filters, userRoles: user.roles }); }

  @Get(':id') @Permissions('announcement:view')
  @ApiOperation({ summary: 'Get announcement by ID' })
  findOne(@Param('id') id: string) { return this.announcementsService.findOne(id); }

  @Patch(':id') @Permissions('announcement:create')
  @ApiOperation({ summary: 'Update announcement' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) { return this.announcementsService.update(id, dto); }

  @Delete(':id') @Permissions('announcement:create')
  @ApiOperation({ summary: 'Delete announcement' })
  remove(@Param('id') id: string) { return this.announcementsService.remove(id); }
}