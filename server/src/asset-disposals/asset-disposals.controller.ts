import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetDisposalsService } from './asset-disposals.service';

@ApiTags('asset-disposals')
@Controller('api/v1/asset-disposals')
export class AssetDisposalsController {
  constructor(private readonly service: AssetDisposalsService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
