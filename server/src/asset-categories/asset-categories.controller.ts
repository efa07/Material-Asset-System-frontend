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
import { AssetCategoriesService } from './asset-categories.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@ApiTags('asset-categories')
@Controller('api/v1/asset-categories')
export class AssetCategoriesController {
  constructor(private readonly service: AssetCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create asset category' })
  create(@Body() createDto: CreateAssetCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all asset categories' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset category by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset category' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset category' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
