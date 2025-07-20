import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { racksAPI } from '../../service/inventoryapi';
import type { RackReqDTO } from '../../types/requestDto';
import type { Rack, Page } from '../../types/responseDto';
import { useAppSelector } from '../../slice/hooks';

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

export const useRackByIdAndUser = (id: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack, Error>({
        queryKey: ['rack', id, loginDetails?.id],
        queryFn: () => racksAPI.getRacksByIdForUser(id),
        enabled: !!id,
    });
}

// Get racks for user
export const useRacksForUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack[], Error>({
        queryKey: ['racks', loginDetails?.id],
        queryFn: () => racksAPI.getRacksForUser(),
    });
};

// Get racks by location for user 
export const useRacksByLocationForUser = (locationid: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack[], Error>({
        queryKey: ['racks', locationid, loginDetails?.id],
        queryFn: () => racksAPI.getRacksByLocationForUser(locationid),
    });
};

// Get racks for user (paged)
export const useRacksForUserPaged = (page: number, size: number) => {
    return useQuery<Page<Rack>, Error>({
        queryKey: ['racks', 'user', { page, size }],
        queryFn: () => racksAPI.getRacksForUserPaged(page, size),
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
export const useSearchRacksByNamePaged = (name: string, page: number, size: number) => {
    return useQuery<Page<Rack>, Error>({
        queryKey: ['racks', 'search', { name, page, size }],
        queryFn: () => racksAPI.searchByNamePaged(name, page, size),
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
