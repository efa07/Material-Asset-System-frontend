import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MockDbService } from './common/mock-db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mockDb: MockDbService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.mockDb.getDashboardStats();
  }

  @Get('dashboard/charts')
  async getDashboardCharts() {
    // compute basic chart data from DB via the MockDbService (Prisma-backed)
    const stats: any = await this.mockDb.getDashboardStats();

    const assetsByStatus = (stats.assetsByStatus || []).map((s: any) => ({ status: s.status, value: s._count?.status || 0 }));

    // assetsTrend and maintenanceByType are not direct models; return simple placeholders
    const assetsTrend = [];
    const maintenanceByType = [];

    return {
      assetsByStatus,
      assetsTrend,
      maintenanceByType,
    };
  }
}
