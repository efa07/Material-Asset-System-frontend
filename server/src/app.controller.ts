import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/v1/dashboard/stats')
  getDashboardStats() {
    return this.appService.getDashboardStats();
  }

  @Get('api/v1/dashboard/charts')
  async getDashboardCharts() {
    const stats: any = await this.appService.getDashboardStats();

    const assetsByStatus = (stats.assetsByStatus || []).map((s: any) => ({
      status: s.status,
      count: s._count?.status || 0,
    }));

    // assetsTrend and maintenanceByType are placeholder for now
    const assetsTrend: any[] = [];
    const maintenanceByType: any[] = [];

    return {
      assetsByStatus,
      assetsTrend,
      maintenanceByType,
    };
  }
}
