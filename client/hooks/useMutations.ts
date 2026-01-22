import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CreateAssignmentRequest } from '@/types';

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
