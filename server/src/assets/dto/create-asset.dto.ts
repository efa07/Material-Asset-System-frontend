import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsDateString, IsDecimal, IsObject } from 'class-validator';
import { AssetStatus } from '../../common/enums';

export class CreateAssetDto {
    @ApiProperty({ example: 'Dell Laptop' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    serialNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    qrCode?: string;

    @ApiProperty({ enum: AssetStatus, default: AssetStatus.AVAILABLE })
    @IsEnum(AssetStatus)
    @IsOptional()
    status?: AssetStatus;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    purchaseDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    purchasePrice?: number;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    specifications?: any;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    storeId?: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    shelfId?: string;
}
