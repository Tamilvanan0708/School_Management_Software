import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() targetRoles?: any;
  @ApiPropertyOptional() @IsOptional() targetClasses?: any;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPinned?: boolean;
}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() targetRoles?: any;
  @ApiPropertyOptional() @IsOptional() targetClasses?: any;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPinned?: boolean;
}