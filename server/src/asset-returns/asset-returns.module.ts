import { Module } from '@nestjs/common';
import { AssetReturnsService } from './asset-returns.service';
import { AssetReturnsController } from './asset-returns.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AssetReturnsController],
  providers: [AssetReturnsService],
})
export class AssetReturnsModule {}
