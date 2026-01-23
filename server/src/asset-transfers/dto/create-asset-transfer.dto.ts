import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAssetTransferDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  fromStoreId?: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  toStoreId: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  transferDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
