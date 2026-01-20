import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetReturnsService } from './asset-returns.service';

@ApiTags('asset-returns')
@Controller('api/v1/asset-returns')
export class AssetReturnsController {
  constructor(private readonly service: AssetReturnsService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
