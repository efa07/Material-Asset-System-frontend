import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAssetReturnDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
