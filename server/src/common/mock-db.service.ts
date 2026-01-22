import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MockDbService {
    constructor(private readonly prisma: PrismaService) {}

    // Map the simple collection names used by older code to Prisma model accessors
    private modelFor(collection: string) {
        const map: Record<string, string> = {
            categories: 'assetCategory',
            stores: 'store',
            shelves: 'shelf',
            assets: 'asset',
            users: 'user',
            assignmentRequests: 'workflow',
            assignments: 'assetAssignment',
            transferRequests: 'assetTransfer',
            maintenanceTasks: 'maintenanceRecord',
            auditLogs: 'auditLog',
            notifications: 'notification',
            // dashboardStats / chart data will be computed
        };
        return map[collection];
    }

    async findAll(collection: string) {
        const model = this.modelFor(collection);
        if (!model) {
            // special cases
            if (collection === 'dashboardStats') return this.getDashboardStats();
            return [];
        }

        // @ts-ignore dynamic access
        return await (this.prisma as any)[model].findMany();
    }

    async findOne(collection: string, id: string) {
        const model = this.modelFor(collection);
        if (!model) return null;

        // @ts-ignore dynamic access
        return await (this.prisma as any)[model].findUnique({ where: { id } });
    }

    async create(collection: string, item: any) {
        const model = this.modelFor(collection);
        if (!model) return null;

        // @ts-ignore dynamic access
        return await (this.prisma as any)[model].create({ data: item });
    }

    async update(collection: string, id: string, item: any) {
        const model = this.modelFor(collection);
        if (!model) return null;

        // @ts-ignore dynamic access
        return await (this.prisma as any)[model].update({ where: { id }, data: item });
    }

    async remove(collection: string, id: string) {
        const model = this.modelFor(collection);
        if (!model) return null;

        // @ts-ignore dynamic access
        return await (this.prisma as any)[model].delete({ where: { id } });
    }

    async getDashboardStats() {
        // Basic aggregated stats for the dashboard
        const totalAssets = await this.prisma.asset.count();
        const assetsByStatus = await this.prisma.asset.groupBy({ by: ['status'], _count: { status: true } });
        const pendingAssignments = await this.prisma.assetAssignment.count({ where: { status: 'ACTIVE' } });
        const pendingTransfers = await this.prisma.assetTransfer.count({ where: { status: 'PENDING' } });
        const maintenanceCount = await this.prisma.maintenanceRecord.count();

        return {
            totalAssets,
            assetsByStatus,
            pendingAssignments,
            pendingTransfers,
            maintenanceCount,
        };
    }
}
