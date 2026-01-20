import { Module } from '@nestjs/common';
import { AssetReturnsService } from './asset-returns.service';
import { AssetReturnsController } from './asset-returns.controller';

@Module({
  controllers: [AssetReturnsController],
  providers: [AssetReturnsService],
})
export class AssetReturnsModule {}
