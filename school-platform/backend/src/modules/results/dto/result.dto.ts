import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnterMarksDto {
  @ApiProperty() @IsArray()
  marks: Array<{ studentId: string; marksObtained: number; grade?: string }>;
}

export class ResultFilterDto {
  @ApiPropertyOptional() @IsOptional() @IsString() examId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() studentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sectionId?: string;
}