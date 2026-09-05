import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto, StudentFilterDto } from './dto/student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Permissions('student:create')
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: any) {
    return this.studentsService.create(dto, user.schoolId);
  }

  @Get()
  @Permissions('student:view')
  @ApiOperation({ summary: 'List students with filters' })
  findAll(@Query() filters: StudentFilterDto, @CurrentUser() user: any) {
    return this.studentsService.findAll(filters, user.schoolId);
  }

  @Get(':id')
  @Permissions('student:view')
  @ApiOperation({ summary: 'Get student by profile ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('user/:userId')
  @Permissions('student:view')
  @ApiOperation({ summary: 'Get student by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.studentsService.getStudentByUserId(userId);
  }

  @Patch(':id')
  @Permissions('student:edit')
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('student:delete')
  @ApiOperation({ summary: 'Deactivate student' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}