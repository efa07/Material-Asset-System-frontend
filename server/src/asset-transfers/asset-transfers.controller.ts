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
import { AssetTransfersService } from './asset-transfers.service';
import { CreateAssetTransferDto } from './dto/create-asset-transfer.dto';
import { UpdateAssetTransferDto } from './dto/update-asset-transfer.dto';

@ApiTags('asset-transfers')
@Controller('api/v1/asset-transfers')
export class AssetTransfersController {
  constructor(private readonly service: AssetTransfersService) {}

  @Post()
  @ApiOperation({ summary: 'Create asset transfer' })
  create(@Body() createDto: CreateAssetTransferDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all asset transfers' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset transfer by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset transfer' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetTransferDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset transfer' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
