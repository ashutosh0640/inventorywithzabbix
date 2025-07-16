import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { racksAPI } from '../../service/inventoryapi';
import type { RackReqDTO } from '../../types/requestDto';
import type { Rack } from '../../types/responseDto';

// Get all racks
export const useRacks = () => {
    return useQuery<Rack[], Error>({
        queryKey: ['racks'],
        queryFn: racksAPI.getAll,
    });
};

// Get rack by ID
export const useRackById = (id: number) => {
    return useQuery<Rack, Error>({
        queryKey: ['rack', id],
        queryFn: () => racksAPI.getById(id),
        enabled: !!id, // Prevents query from running if id is undefined
    });
};

// Get racks for user (paged)
export const useRacksForUserPaged = (pageSize: number, pageNumber: number) => {
    return useQuery<Rack[], Error>({
        queryKey: ['racks', 'user', { pageSize, pageNumber }],
        queryFn: () => racksAPI.getRacksForUserPaged(pageSize, pageNumber),
    });
};


// Get racks count for user
export const useRacksCountByUser = (id: number) => {
    return useQuery<number, Error>({
        queryKey: ['racksCount', 'ByUser', id],
        queryFn: racksAPI.countByUser,
    });
}





// Search by name (paged)
export const useSearchRacksByNamePaged = (name: string, pageSize: number, pageNumber: number) => {
    return useQuery<Rack[], Error>({
        queryKey: ['racks', 'search', { name, pageSize, pageNumber }],
        queryFn: () => racksAPI.searchByNamePaged(name, pageSize, pageNumber),
        enabled: !!name, // Only run when name is non-empty
    });
};

// Create a new rack
export const useCreateRack = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RackReqDTO) => racksAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['racks'] });
        },
    });
};

// Update rack
export const useUpdateRack = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RackReqDTO }) => racksAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['racks'] });
        },
    });
};

// Delete rack
export const useDeleteRack = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => racksAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['racks'] });
        },
    });
};
