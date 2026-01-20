import { Injectable } from '@nestjs/common';
import * as mockData from './mock-db';

@Injectable()
export class MockDbService {
    private data = {
        categories: [...mockData.mockCategories],
        stores: [...mockData.mockStores],
        shelves: [...mockData.mockShelves],
        assets: [...mockData.mockAssets],
        users: [...mockData.mockUsers],
        assignmentRequests: [...mockData.mockAssignmentRequests],
        assignments: [...mockData.mockAssignments],
        transferRequests: [...mockData.mockTransferRequests],
        maintenanceTasks: [...mockData.mockMaintenanceTasks],
        auditLogs: [...mockData.mockAuditLogs],
        notifications: [...mockData.mockNotifications],
        dashboardStats: { ...mockData.mockDashboardStats },
        assetsByStatus: [...mockData.assetsByStatusData],
        assetsTrend: [...mockData.assetsTrendData],
        maintenanceByType: [...mockData.maintenanceByTypeData],
    };

    findAll(collection: keyof typeof this.data) {
        return this.data[collection];
    }

    findOne(collection: keyof typeof this.data, id: number) {
        if (Array.isArray(this.data[collection])) {
            return (this.data[collection] as any[]).find((item) => item.id.toString() === id.toString());
        }
        return null;
    }

    create(collection: keyof typeof this.data, item: any) {
        if (Array.isArray(this.data[collection])) {
            const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
            (this.data[collection] as any[]).push(newItem);
            return newItem;
        }
        return null;
    }

    update(collection: keyof typeof this.data, id: number, item: any) {
        if (Array.isArray(this.data[collection])) {
            const index = (this.data[collection] as any[]).findIndex((i) => i.id.toString() === id.toString());
            if (index !== -1) {
                (this.data[collection] as any[])[index] = { ...(this.data[collection] as any[])[index], ...item };
                return (this.data[collection] as any[])[index];
            }
        }
        return null;
    }

    remove(collection: keyof typeof this.data, id: number) {
        if (Array.isArray(this.data[collection])) {
            const index = (this.data[collection] as any[]).findIndex((i) => i.id.toString() === id.toString());
            if (index !== -1) {
                const removed = (this.data[collection] as any[]).splice(index, 1);
                return removed[0];
            }
        }
        return null;
    }

    getDashboardStats() {
        return this.data.dashboardStats;
    }
}
