import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAssetDisposalDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  disposalDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  value?: number;
}
