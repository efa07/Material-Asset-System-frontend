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
import { AssetDisposalsService } from './asset-disposals.service';
import { CreateAssetDisposalDto } from './dto/create-asset-disposal.dto';
import { UpdateAssetDisposalDto } from './dto/update-asset-disposal.dto';

@ApiTags('asset-disposals')
@Controller('api/v1/asset-disposals')
export class AssetDisposalsController {
  constructor(private readonly service: AssetDisposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create disposal record' })
  create(@Body() createDto: CreateAssetDisposalDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all disposal records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get disposal record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update disposal record' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetDisposalDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete disposal record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
