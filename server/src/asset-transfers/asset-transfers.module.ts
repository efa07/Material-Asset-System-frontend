import { Module } from '@nestjs/common';
import { AssetTransfersService } from './asset-transfers.service';
import { AssetTransfersController } from './asset-transfers.controller';

@Module({
  controllers: [AssetTransfersController],
  providers: [AssetTransfersService],
})
export class AssetTransfersModule {}
