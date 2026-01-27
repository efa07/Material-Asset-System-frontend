import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Controller('api/v1/maintenance')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create maintenance record' })
  create(@Body() createDto: CreateMaintenanceDto) {
    // If reportedByUserId is in DTO, it will be used.
    return this.service.create(createDto, createDto.reportedByUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get maintenance record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update maintenance record' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMaintenanceDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete maintenance record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
