import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    CreateAssignmentRequest,
    CreateAssetRequest,
    CreateAssetCategoryRequest,
    UpdateAssetRequest,
    UpdateAssetCategoryRequest,
    CreateAssetDisposalRequest,
    UpdateAssetDisposalRequest,
    CreateAssetReturnRequest,
    UpdateAssetReturnRequest,
    CreateAssetTransferRequest,
    UpdateAssetTransferRequest,
    CreateShelfRequest,
} from '@/types';

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssignmentRequest) => {
            const response = await api.post('/asset-assignments', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useCreateShelf = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateShelfRequest) => {
            const response = await api.post('/shelves', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shelves'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
    });
};

export const useCreateAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssetRequest) => {
            const response = await api.post('/assets', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useUpdateAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateAssetRequest) => {
            const response = await api.patch(`/assets/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useDeleteAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/assets/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useCreateAssetCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssetCategoryRequest) => {
            const response = await api.post('/asset-categories', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateAssetCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateAssetCategoryRequest) => {
            const response = await api.patch(`/asset-categories/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useDeleteAssetCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/asset-categories/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateMaintenanceTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: {id: string, description?: string, status?: any}) => {
             // Mapping notes to description if needed.
             // The form has "notes".
            const response = await api.patch(`/maintenance/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
        },
    });
};

export const useCreateMaintenanceTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/maintenance', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
        },
    });
};

export const useCreateDisposal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssetDisposalRequest) => {
            const response = await api.post('/asset-disposals', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useUpdateDisposal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateAssetDisposalRequest) => {
            const response = await api.patch(`/asset-disposals/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
    });
};

export const useDeleteDisposal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/asset-disposals/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
    });
};

export const useCreateReturn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssetReturnRequest) => {
            const response = await api.post('/asset-returns', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useUpdateReturn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateAssetReturnRequest) => {
            const response = await api.patch(`/asset-returns/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
        },
    });
};

export const useDeleteReturn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/asset-returns/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
        },
    });
};

export const useCreateTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateAssetTransferRequest) => {
            const response = await api.post('/asset-transfers', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
    });
};

export const useUpdateTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateAssetTransferRequest) => {
            const response = await api.patch(`/asset-transfers/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
        },
    });
};

export const useDeleteTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/asset-transfers/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
        },
    });
};
