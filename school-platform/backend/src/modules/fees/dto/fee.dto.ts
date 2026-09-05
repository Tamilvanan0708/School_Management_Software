import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeeStructureDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiPropertyOptional() @IsOptional() @IsString() classId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() academicYearId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class AssignFeeDto {
  @ApiProperty() @IsString() feeStructureId: string;
  @ApiProperty() @IsString() classId: string;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() feePaymentId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payerUserId?: string;
}

export class VerifyPaymentDto {
  @ApiProperty() @IsString() feePaymentId: string;
  @ApiProperty() @IsString() razorpayOrderId: string;
  @ApiProperty() @IsString() razorpayPaymentId: string;
  @ApiProperty() @IsString() razorpaySignature: string;
}