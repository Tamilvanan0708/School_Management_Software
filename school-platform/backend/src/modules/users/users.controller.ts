import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('parents') @Permissions('user:create')
  @ApiOperation({ summary: 'Create parent account' })
  createParent(@Body() dto: any, @CurrentUser() user: any) { return this.usersService.createParent(dto, user.schoolId); }

  @Post('parents/children') @Permissions('user:edit')
  @ApiOperation({ summary: 'Link a parent to a student' })
  link(@Body() dto: any) { return this.usersService.linkChild(dto); }

  @Post('parents/children/unlink') @Permissions('user:edit')
  unlink(@Body() dto: any) { return this.usersService.unlinkChild(dto); }

  @Get('parents/:parentUserId/children') @Permissions('user:view', 'fee:pay')
  @ApiOperation({ summary: 'List children of a parent' })
  children(@Param('parentUserId') parentUserId: string, @CurrentUser() user: any) {
    if (!user.roles?.includes('owner') && user.id !== parentUserId && !user.permissions?.includes('user:view')) {
      return this.usersService.childrenOf(user.id);
    }
    return this.usersService.childrenOf(parentUserId);
  }
}