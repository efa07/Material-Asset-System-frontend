import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Asset, User, Store, AssetCategory, Notification, AuditLog, MaintenanceTask, DashboardStats } from '@/types';

export const useAssets = () => {
    return useQuery<Asset[]>({
        queryKey: ['assets'],
        queryFn: async () => {
            const { data } = await api.get('/assets');
            return data;
        },
    });
};

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get('/users');
            return data;
        },
    });
};

export const useStores = () => {
    return useQuery<Store[]>({
        queryKey: ['stores'],
        queryFn: async () => {
            const { data } = await api.get('/stores');
            return data;
        },
    });
};

export const useCategories = () => {
    return useQuery<AssetCategory[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/asset-categories');
            return data;
        },
    });
};

export const useNotifications = () => {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications');
            return data;
        },
    });
};

export const useAuditLogs = () => {
    return useQuery<AuditLog[]>({
        queryKey: ['audit-logs'],
        queryFn: async () => {
            const { data } = await api.get('/audit');
            return data;
        },
    });
};

export const useMaintenanceTasks = () => {
    return useQuery<MaintenanceTask[]>({
        queryKey: ['maintenance-tasks'],
        queryFn: async () => {
            const { data } = await api.get('/maintenance');
            return data;
        },
    });
};

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data;
        },
    });
};

export const useDashboardCharts = () => {
    return useQuery<{
        assetsByStatus: any[];
        assetsTrend: any[];
        maintenanceByType: any[];
    }>({
        queryKey: ['dashboard-charts'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/charts');
            return data;
        },
    });
};

import { Assignment } from '@/types';

export const useAssignments = () => {
    return useQuery<Assignment[]>({
        queryKey: ['assignments'],
        queryFn: async () => {
            const { data } = await api.get('/asset-assignments');
            return data;
        },
    });
};

export const useTransferRequests = () => {
    return useQuery<any[]>({
        queryKey: ['transfer-requests'],
        queryFn: async () => {
            const { data } = await api.get('/asset-transfers');
            return data;
        },
    });
};
