import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get() @Permissions('role:view')
  @ApiOperation({ summary: 'List roles with permission sets + user counts' })
  list(@CurrentUser() user: any) { return this.rolesService.listRoles(user.schoolId); }

  @Get('permissions') @Permissions('role:view')
  @ApiOperation({ summary: 'List all permission options' })
  permissions(@CurrentUser() user: any) { return this.rolesService.listPermissions(user.schoolId); }

  @Post() @Permissions('role:create')
  @ApiOperation({ summary: 'Create custom role' })
  create(@Body() dto: any, @CurrentUser() user: any) { return this.rolesService.createRole(user.schoolId, dto); }

  @Patch(':id/permissions') @Permissions('role:edit', 'role:create')
  @ApiOperation({ summary: 'Replace permission matrix for a role' })
  setPerms(@Param('id') id: string, @Body() body: { permissionIds: string[] }) { return this.rolesService.setRolePermissions(id, body.permissionIds); }

  @Post('assign') @Permissions('role:edit')
  @ApiOperation({ summary: 'Assign primary role to a user' })
  assign(@Body() body: { userId: string; roleId: string }, @CurrentUser() user: any) {
    return this.rolesService.setUserRole(body.userId, body.roleId, user.schoolId);
  }
}