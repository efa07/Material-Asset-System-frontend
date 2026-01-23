import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateMaintenanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  performedBy?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  maintenanceDate?: string;

  @ApiProperty({
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;
}
