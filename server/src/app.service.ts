import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Welcome to Material & Asset Management System!';
  }

  async getDashboardStats() {
    const totalAssets = await this.prisma.asset.count();
    const activeAssignments = await this.prisma.assetAssignment.count({
      where: { status: 'ACTIVE' },
    });
    const lowStockItems = 0; // Logic for low stock if needed
    const pendingMaintenance = await this.prisma.maintenanceRecord.count({
      where: { type: 'PENDING' },
    }); 

    const assetsByStatus = await this.prisma.asset.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return {
      totalAssets,
      activeAssignments,
      lowStockItems,
      pendingMaintenance,
      assetsByStatus, 
    };
  }
}
