import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@ApiTags('assets')
@Controller('api/v1/assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) { }

    @Post()
    @ApiOperation({ summary: 'Create asset' })
    create(@Body() createAssetDto: CreateAssetDto) {
        return this.assetsService.create(createAssetDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all assets' })
    findAll() {
        return this.assetsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get asset by ID' })
    findOne(@Param('id') id: string) {
        return this.assetsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update asset' })
    update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
        return this.assetsService.update(id, updateAssetDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete asset' })
    remove(@Param('id') id: string) {
        return this.assetsService.remove(id);
    }
}
