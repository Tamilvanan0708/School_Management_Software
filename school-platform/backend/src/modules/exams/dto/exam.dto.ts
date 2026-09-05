import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty() @IsString() schoolId: string;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiProperty() @IsString() startDate: string;
  @ApiProperty() @IsString() endDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() academicYearId?: string;
}

export class CreateExamScheduleDto {
  @ApiProperty() @IsString() subjectId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sectionId?: string;
  @ApiProperty() @IsString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxMarks?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() room?: string;
}

export class EnterMarksDto {
  @ApiProperty() @IsArray()
  marks: Array<{ studentId: string; marksObtained: number; grade?: string }>;
}