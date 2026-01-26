import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
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
            toast.success('Asset assigned successfully');
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to assign asset';
            toast.error(message);
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
            toast.success('Shelf created');
            queryClient.invalidateQueries({ queryKey: ['shelves'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create shelf';
            toast.error(message);
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
            toast.success('Asset created');
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create asset';
            toast.error(message);
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
            toast.success('Asset updated');
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update asset';
            toast.error(message);
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
            toast.success('Asset deleted');
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete asset';
            toast.error(message);
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
            toast.success('Category created');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create category';
            toast.error(message);
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
            toast.success('Category updated');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update category';
            toast.error(message);
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
            toast.success('Category deleted');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete category';
            toast.error(message);
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
            toast.success('Maintenance task updated');
            queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update maintenance task';
            toast.error(message);
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
            toast.success('Maintenance task created');
            queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create maintenance task';
            toast.error(message);
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
            toast.success('Disposal requested');
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to request disposal';
            toast.error(message);
        },
    });
};

export const useApproveDisposal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/asset-disposals/${id}/approve`, {});
            return response.data;
        },
        onSuccess: () => {
            toast.success('Disposal approved');
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to approve disposal';
            toast.error(message);
        },
    });
};

export const useRejectDisposal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/asset-disposals/${id}/reject`, {});
            return response.data;
        },
        onSuccess: () => {
            toast.success('Disposal rejected');
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to reject disposal';
            toast.error(message);
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
            toast.success('Disposal updated');
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update disposal';
            toast.error(message);
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
            toast.success('Disposal deleted');
            queryClient.invalidateQueries({ queryKey: ['disposals'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete disposal';
            toast.error(message);
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
            toast.success('Asset returned');
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create return';
            toast.error(message);
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
            toast.success('Return updated');
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update return';
            toast.error(message);
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
            toast.success('Return deleted');
            queryClient.invalidateQueries({ queryKey: ['asset-returns'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete return';
            toast.error(message);
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
            toast.success('Transfer submitted');
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create transfer';
            toast.error(message);
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
            toast.success('Transfer updated');
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update transfer';
            toast.error(message);
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
            toast.success('Transfer deleted');
            queryClient.invalidateQueries({ queryKey: ['transfer-requests'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete transfer';
            toast.error(message);
        },
    });
};

export const useCreateStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/stores', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Store created');
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create store';
            toast.error(message);
        },
    });
};

export const useUpdateStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: string } & any) => {
            const response = await api.patch(`/stores/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Store updated');
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update store';
            toast.error(message);
        },
    });
};

export const useDeleteStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/stores/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Store deleted');
            queryClient.invalidateQueries({ queryKey: ['stores'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete store';
            toast.error(message);
        },
    });
};

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: string } & any) => {
            const response = await api.patch(`/asset-assignments/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Assignment updated');
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update assignment';
            toast.error(message);
        },
    });
};
