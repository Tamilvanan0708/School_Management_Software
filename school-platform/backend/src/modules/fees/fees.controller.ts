import { Controller, Get, Post, Body, Param, Req, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { CreateFeeStructureDto, AssignFeeDto, CreateOrderDto, VerifyPaymentDto } from './dto/fee.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Fees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('structures') @Permissions('fee:create')
  @ApiOperation({ summary: 'Create fee structure' })
  createStructure(@Body() dto: CreateFeeStructureDto, @CurrentUser() user: any) {
    return this.feesService.createStructure(dto, user.schoolId);
  }

  @Get('structures') @Permissions('fee:view')
  getStructures(@CurrentUser() user: any) { return this.feesService.getStructures(user.schoolId); }

  @Post('assign') @Permissions('fee:create')
  @ApiOperation({ summary: 'Assign a fee structure to all students in a class' })
  assign(@Body() dto: AssignFeeDto) { return this.feesService.assignFee(dto); }

  @Get('students') @Permissions('fee:pay')
  @ApiOperation({ summary: 'List my children (parent) for the fee screen' })
  getMyChildren(@CurrentUser() user: any) { return this.feesService.getChildrenForParent(user.id); }

  @Get('pending') @Permissions('fee:pay')
  @ApiOperation({ summary: 'Pending fee payments for my children (parent)' })
  getMyPending(@CurrentUser() user: any) { return this.feesService.getPendingPaymentsForUser(user.id); }

  @Get('student/:studentId/ledger') @Permissions('fee:view')
  @ApiOperation({ summary: 'Student fee ledger (due/paid)' })
  getLedger(@Param('studentId') studentId: string) { return this.feesService.getStudentLedger(studentId); }

  @Post('order') @Permissions('fee:pay')
  @ApiOperation({ summary: 'Create Razorpay order (validates parent-child link)' })
  createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.feesService.createOrder({ ...dto, payerUserId: user.id });
  }

  @Post('verify') @Permissions('fee:pay')
  @ApiOperation({ summary: 'Verify payment signature and mark paid' })
  verify(@Body() dto: VerifyPaymentDto, @CurrentUser() user: any) {
    return this.feesService.verifyAndMarkPaid(dto, user.id);
  }

  @Get('pending-all') @Permissions('fee:view')
  @ApiOperation({ summary: 'All pending payments (admin)' })
  getPending(@CurrentUser() user: any) { return this.feesService.getPendingPayments(user.schoolId); }

  @Get('summary') @Permissions('fee:view')
  @ApiOperation({ summary: 'Fee collection summary' })
  getSummary(@CurrentUser() user: any) { return this.feesService.getCollectionSummary(user.schoolId); }
}

@Controller('fees/webhook')
export class FeesWebhookController {
  constructor(private readonly feesService: FeesService) {}

  @Post('razorpay')
  @ApiOperation({ summary: 'Razorpay webhook (no auth — verified by signature)' })
  handle(@Body() body: any, @Headers('x-razorpay-signature') signature: string, @Req() req: any) {
    return this.feesService.handleWebhook(body, signature, req.rawBody);
  }
}