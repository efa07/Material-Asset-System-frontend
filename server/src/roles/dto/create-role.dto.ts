import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'Store Manager', description: 'Role name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Manages store operations', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, description: 'Permissions JSON object' })
    @IsObject()
    @IsOptional()
    permissions?: any;
}
