import { Controller, Get, Post, Delete, Body, Param, Query, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get() @Permissions('homework:view')
  @ApiOperation({ summary: 'List study materials (filter by section/subject)' })
  list(@CurrentUser() user: any, @Query() filters: any) { return this.materialsService.list(user.schoolId, filters); }

  @Post() @Permissions('homework:create')
  @ApiOperation({ summary: 'Create material record (returns uploadUrl)' })
  create(@Body() dto: any, @CurrentUser() user: any) { return this.materialsService.uploadMeta(dto, user.id); }

  @Post(':id/file') @Permissions('homework:create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload file for a material record' })
  upload(@Param('id') id: string, @UploadedFile() file: any) { return this.materialsService.uploadFile(id, file); }

  @Delete(':id') @Permissions('homework:delete')
  remove(@Param('id') id: string) { return this.materialsService.remove(id); }
}