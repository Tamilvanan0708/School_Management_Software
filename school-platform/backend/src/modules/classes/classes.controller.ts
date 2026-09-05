import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto, CreateSectionDto } from './dto/class.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post() @Permissions('class:create')
  @ApiOperation({ summary: 'Create a class' })
  create(@Body() dto: CreateClassDto, @CurrentUser() user: any) { return this.classesService.create(dto, user.schoolId); }

  @Get() @Permissions('class:view')
  @ApiOperation({ summary: 'List all classes' })
  findAll(@CurrentUser() user: any) { return this.classesService.findAll(user.schoolId); }

  @Get(':id') @Permissions('class:view')
  @ApiOperation({ summary: 'Get class by ID' })
  findOne(@Param('id') id: string) { return this.classesService.findOne(id); }

  @Patch(':id') @Permissions('class:edit')
  @ApiOperation({ summary: 'Update class' })
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) { return this.classesService.update(id, dto); }

  @Delete(':id') @Permissions('class:delete')
  @ApiOperation({ summary: 'Delete class' })
  remove(@Param('id') id: string) { return this.classesService.remove(id); }

  @Post(':id/sections') @Permissions('class:edit')
  @ApiOperation({ summary: 'Add section to class' })
  addSection(@Param('id') id: string, @Body() dto: CreateSectionDto) { return this.classesService.addSection(id, dto); }

  @Delete('sections/:id') @Permissions('class:edit')
  @ApiOperation({ summary: 'Remove section' })
  removeSection(@Param('id') id: string) { return this.classesService.removeSection(id); }
}