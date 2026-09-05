import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto, TeacherFilterDto } from './dto/teacher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post() @Permissions('teacher:create')
  @ApiOperation({ summary: 'Create a new teacher' })
  create(@Body() dto: CreateTeacherDto, @CurrentUser() user: any) { return this.teachersService.create(dto, user.schoolId); }

  @Get() @Permissions('teacher:view')
  @ApiOperation({ summary: 'List teachers' })
  findAll(@Query() filters: TeacherFilterDto, @CurrentUser() user: any) { return this.teachersService.findAll(filters, user.schoolId); }

  @Get(':id') @Permissions('teacher:view')
  @ApiOperation({ summary: 'Get teacher by ID' })
  findOne(@Param('id') id: string) { return this.teachersService.findOne(id); }

  @Patch(':id') @Permissions('teacher:edit')
  @ApiOperation({ summary: 'Update teacher' })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) { return this.teachersService.update(id, dto); }

  @Delete(':id') @Permissions('teacher:delete')
  @ApiOperation({ summary: 'Delete teacher' })
  remove(@Param('id') id: string) { return this.teachersService.remove(id); }
}