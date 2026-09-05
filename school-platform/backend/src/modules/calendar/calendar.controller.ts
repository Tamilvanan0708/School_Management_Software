import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto, CreateHolidayDto } from './dto/calendar.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events') @Permissions('announcement:view')
  @ApiOperation({ summary: 'List events (optionally by date range)' })
  findEvents(@CurrentUser() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.calendarService.findEvents(user.schoolId, from, to);
  }

  @Post('events') @Permissions('announcement:create')
  @ApiOperation({ summary: 'Create event' })
  createEvent(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.calendarService.createEvent(dto, user.schoolId, user.id);
  }

  @Patch('events/:id') @Permissions('announcement:create')
  updateEvent(@Param('id') id: string, @Body() dto: CreateEventDto) { return this.calendarService.updateEvent(id, dto); }

  @Delete('events/:id') @Permissions('announcement:create')
  deleteEvent(@Param('id') id: string) { return this.calendarService.deleteEvent(id); }

  @Get('holidays') @Permissions('announcement:view')
  findHolidays(@CurrentUser() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.calendarService.findHolidays(user.schoolId, from, to);
  }

  @Post('holidays') @Permissions('announcement:create')
  @ApiOperation({ summary: 'Create holiday' })
  createHoliday(@Body() dto: CreateHolidayDto, @CurrentUser() user: any) {
    return this.calendarService.createHoliday(dto, user.schoolId);
  }

  @Delete('holidays/:id') @Permissions('announcement:create')
  deleteHoliday(@Param('id') id: string) { return this.calendarService.deleteHoliday(id); }
}