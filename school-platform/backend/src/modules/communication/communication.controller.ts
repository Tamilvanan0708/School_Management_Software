import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommunicationService } from './communication.service';
import { SendMessageDto } from './dto/communication.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Communication')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  send(@Body() dto: SendMessageDto, @CurrentUser() user: any) {
    return this.communicationService.send(dto, user.id);
  }

  @Get('threads')
  @ApiOperation({ summary: 'List message threads for current user' })
  getThreads(@CurrentUser() user: any) { return this.communicationService.getThreads(user.id); }

  @Get('threads/:otherId')
  @ApiOperation({ summary: 'Get a conversation thread with another user' })
  getThread(@Param('otherId') otherId: string, @CurrentUser() user: any) {
    return this.communicationService.getThread(user.id, otherId);
  }

  @Post('threads/:otherId/read')
  markRead(@Param('otherId') otherId: string, @CurrentUser() user: any) {
    return this.communicationService.markThreadRead(user.id, otherId);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: any) { return this.communicationService.getUnreadCount(user.id); }
}