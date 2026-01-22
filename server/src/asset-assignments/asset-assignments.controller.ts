import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetAssignmentsService } from './asset-assignments.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './dto/update-asset-assignment.dto';

@ApiTags('asset-assignments')
@Controller('api/v1/asset-assignments')
export class AssetAssignmentsController {
  constructor(private readonly service: AssetAssignmentsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  create(@Body() createDto: CreateAssetAssignmentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetAssignmentDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
