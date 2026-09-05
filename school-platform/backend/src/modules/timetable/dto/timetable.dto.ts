import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimetableEntryDto {
  @ApiProperty() @IsString() sectionId: string;
  @ApiProperty() @IsString() subjectId: string;
  @ApiProperty() @IsString() teacherId: string;
  @ApiProperty() @IsNumber() dayOfWeek: number;
  @ApiProperty() @IsNumber() periodNumber: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() room?: string;
}

export class BulkTimetableDto {
  @ApiProperty() @IsArray() entries: CreateTimetableEntryDto[];
}