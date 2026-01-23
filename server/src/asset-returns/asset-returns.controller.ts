import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetReturnsService } from './asset-returns.service';
import { CreateAssetReturnDto } from './dto/create-asset-return.dto';
import { UpdateAssetReturnDto } from './dto/update-asset-return.dto';

@ApiTags('asset-returns')
@Controller('api/v1/asset-returns')
export class AssetReturnsController {
  constructor(private readonly service: AssetReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create asset return' })
  create(@Body() createDto: CreateAssetReturnDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all asset returns' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset return by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset return' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetReturnDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset return' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
