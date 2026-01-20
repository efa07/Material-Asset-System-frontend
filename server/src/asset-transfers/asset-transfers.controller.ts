import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetTransfersService } from './asset-transfers.service';

@ApiTags('asset-transfers')
@Controller('api/v1/asset-transfers')
export class AssetTransfersController {
  constructor(private readonly service: AssetTransfersService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
