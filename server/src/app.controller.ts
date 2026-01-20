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
  getDashboardCharts() {
    return {
      assetsByStatus: this.mockDb.findAll('assetsByStatus'),
      assetsTrend: this.mockDb.findAll('assetsTrend'),
      maintenanceByType: this.mockDb.findAll('maintenanceByType'),
    };
  }
}
