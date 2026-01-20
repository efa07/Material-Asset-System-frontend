import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateStoreDto {
    @ApiProperty({ example: 'Main Warehouse', description: 'Store name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Building A, Floor 1', required: false })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({ example: 'Primary storage facility', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: true, required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
