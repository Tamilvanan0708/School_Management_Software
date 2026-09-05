import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post() @Permissions('class:create')
  create(@Body() dto: CreateSubjectDto, @CurrentUser() user: any) { return this.subjectsService.create(dto, user.schoolId); }

  @Get() @Permissions('class:view')
  findAll(@CurrentUser() user: any) { return this.subjectsService.findAll(user.schoolId); }

  @Get(':id') @Permissions('class:view')
  @ApiOperation({ summary: 'Subject detail with classes + materials' })
  findOne(@Param('id') id: string) { return this.subjectsService.findOne(id); }

  @Patch(':id') @Permissions('class:edit')
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) { return this.subjectsService.update(id, dto); }

  @Delete(':id') @Permissions('class:delete')
  remove(@Param('id') id: string) { return this.subjectsService.remove(id); }
}