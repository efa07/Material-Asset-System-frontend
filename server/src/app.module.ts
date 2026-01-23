import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { StoresModule } from './stores/stores.module';
import { ShelvesModule } from './shelves/shelves.module';
import { AssetsModule } from './assets/assets.module';
import { AssetCategoriesModule } from './asset-categories/asset-categories.module';
import { AssetAssignmentsModule } from './asset-assignments/asset-assignments.module';
import { AssetTransfersModule } from './asset-transfers/asset-transfers.module';
import { AssetReturnsModule } from './asset-returns/asset-returns.module';
import { AssetDisposalsModule } from './asset-disposals/asset-disposals.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PerformanceModule } from './performance/performance.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    StoresModule,
    ShelvesModule,
    AssetsModule,
    AssetCategoriesModule,
    AssetAssignmentsModule,
    AssetTransfersModule,
    AssetReturnsModule,
    AssetDisposalsModule,
    MaintenanceModule,
    PerformanceModule,
    WorkflowsModule,
    NotificationsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
