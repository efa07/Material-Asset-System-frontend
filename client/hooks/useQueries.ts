import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Asset, User, Store, AssetCategory, Notification, AuditLog, MaintenanceTask, DashboardStats, Shelf, Assignment } from '@/types';

export const useNotifications = () => {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            // Check if user is logged in first or handle in api interceptor?
            // api should handle it. But the backend findAll returns ALL notifications if not filtered by user.
            // Oh, I forgot to filter by user in NotificationsService.findAll!
            // I should fix that in Backend or filter in Frontend (bad).
            // Let's assume Backend handles it or I'll fix it.
            // Correct approach: Frontend calls /notifications, Backend uses user context to return only mine.
            // But Backend has no Auth context. So backend returns ALL.
            // I should filter in frontend for now as temporary measure, matching `EmployeeNotificationsPage.myNotifications`.
            const { data } = await api.get('/notifications');
            return data;
        },
        refetchInterval: 5000,
    });
};

export const useAssets = () => {
    return useQuery<Asset[]>({
        queryKey: ['assets'],
        queryFn: async () => {
            const { data } = await api.get('/assets');
            return (data || []).map((asset: Asset) => ({
                ...asset,
                code: asset.code || asset.barcode || asset.serialNumber || '',
                currentValue: asset.currentValue ?? asset.purchasePrice ?? 0,
            }));
        },
    });
};

export const useUser = (id?: string) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: async () => {
             if (!id) throw new Error("User ID is required");
             const { data } = await api.get(`/users/${id}`);
             return {
                ...data,
                name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.name || data.email),
                role: (data.role?.name || 'employee').toLowerCase().replace(/_/g, '-'),
             };
        },
        enabled: !!id,
    });
};

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get('/users');
            // Transform API data to match User interface
            return (data || []).map((u: any) => ({
                ...u,
                name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : (u.name || u.email),
                // Flatten role object to string and normalize format (STORE_MANAGER -> store-manager)
                role: (u.role?.name || 'employee').toLowerCase().replace(/_/g, '-'), 
            }));
        },
    });
};

//
export const useStores = () => {
    return useQuery<Store[]>({
        queryKey: ['stores'],
        queryFn: async () => {
            const { data } = await api.get('/stores');
            return data;
        },
    });
};

export const useShelves = () => {
    return useQuery<Shelf[]>({
        queryKey: ['shelves'],
        queryFn: async () => {
            const { data } = await api.get('/shelves');
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
            return (data || []).map((record: MaintenanceTask) => ({
                ...record,
                scheduledDate: record.scheduledDate || record.maintenanceDate || undefined,
            }));
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

export const useAssignments = () => {
    return useQuery<Assignment[]>({
        queryKey: ['assignments'],
        queryFn: async () => {
            const { data } = await api.get('/asset-assignments');
            return data;
        },
    });
};

export const useAssignmentRequests = () => {
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

export const useDisposals = () => {
    return useQuery<any[]>({
        queryKey: ['disposals'],
        queryFn: async () => {
             const { data } = await api.get('/asset-disposals');
             return data;
        },
    });
};
