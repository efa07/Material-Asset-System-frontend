import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}
