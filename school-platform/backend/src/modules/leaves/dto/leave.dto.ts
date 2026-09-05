import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveDto {
  @ApiProperty() @IsString() @IsIn(['student', 'staff']) leaveType: string;
  @ApiProperty() @IsString() startDate: string;
  @ApiProperty() @IsString() endDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class ApproveLeaveDto {
  @ApiProperty() @IsString() @IsIn(['APPROVED', 'REJECTED']) status: 'APPROVED' | 'REJECTED';
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
}