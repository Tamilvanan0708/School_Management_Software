import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MarkAttendanceDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsEnum(['PRESENT', 'ABSENT', 'LATE', 'LEAVE']) status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
}

export class BulkAttendanceDto {
  @ApiProperty() @IsArray() records: Array<{ userId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'; remarks?: string }>;
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty() @IsString() sectionId: string;
}

export class AttendanceFilterDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() fromDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() toDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}