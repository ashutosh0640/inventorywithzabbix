import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { racksAPI } from '../../service/inventoryapi';
import { locationQueryKeys } from '../inventoryQuery/locationQuery'
import type { RackReqDTO } from '../../types/requestDto';
import type { Rack, Page, RackSlot } from '../../types/responseDto';
import { useAppSelector } from '../../slice/hooks';


const RACKS = 'Racks' as const;

/** e.g. queryKeys.list() ➜ ['Projects','list'] */
export const rackQueryKeys = {
    base: [RACKS] as const,
    list: () => [...rackQueryKeys.base, 'list'] as const,
    paged: (p: number, s: number) =>
        [...rackQueryKeys.base, 'paged', p, s] as const,
    search: (n: string, p: number, s: number) =>
        [...rackQueryKeys.base, 'search', n, p, s] as const,
    sorted: () => [...rackQueryKeys.base, 'sorted'] as const,
    detail: (id: number) => [...rackQueryKeys.base, id] as const
};

// Get all racks
export const useRacks = () => {
    return useQuery<Rack[], Error>({
        queryKey: rackQueryKeys.list(),
        queryFn: racksAPI.getAll,
    });
};

// Get rack by ID
export const useRackById = (id: number) => {
    return useQuery<Rack, Error>({
        queryKey: rackQueryKeys.detail(id),
        queryFn: () => racksAPI.getById(id),
        enabled: !!id, // Prevents query from running if id is undefined
    });
};

export const useRackByIdAndUser = (id: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack, Error>({
        queryKey: [rackQueryKeys.detail(id), loginDetails?.id],
        queryFn: () => racksAPI.getRacksByIdForUser(id),
        enabled: !!id,
    });
}

export const useRackSlots = (id: number | null) => {
    return useQuery<RackSlot[], Error>({
        queryKey: [rackQueryKeys.detail(id ?? 0), 'slots'],
        queryFn: () => racksAPI.getSlotByRack(id ?? 0),
        enabled: !!id
    })
}

// Get racks for user
export const useRacksForUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack[], Error>({
        queryKey: [...rackQueryKeys.list(), loginDetails?.id],
        queryFn: () => racksAPI.getRacksForUser(),
    });
};


// Get racks by location for user 
export const useRacksByLocationForUser = (locationid: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Rack[], Error>({
        queryKey: [rackQueryKeys.list, locationid, loginDetails?.id],
        queryFn: () => racksAPI.getRacksByLocationForUser(locationid),
        enabled: !!locationid
    });
};

// Get racks for user (paged)
export const useRacksForUserPaged = (page: number, size: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Page<Rack>, Error>({
        queryKey: [rackQueryKeys.paged(page, size), loginDetails?.id],
        queryFn: () => racksAPI.getRacksForUserPaged(page, size),
    });
};


// Get racks count for user
export const useRacksCountByUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<number, Error>({
        queryKey: [rackQueryKeys.base, "count", loginDetails?.id],
        queryFn: racksAPI.countByUser,
    });
}


// Search by name (paged)
export const useSearchRacksByNamePaged = (name: string, page: number, size: number) => {
    return useQuery<Page<Rack>, Error>({
        queryKey: [rackQueryKeys.paged(page, size), name],
        queryFn: () => racksAPI.searchByNamePaged(name, page, size),
        enabled: !!name, // Only run when name is non-empty
    });
};



const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: rackQueryKeys.base });

const locationInvalidatedLists = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: locationQueryKeys.base })

// Create a new rack
export const useCreateRack = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RackReqDTO) => racksAPI.create(data),
        onSuccess: () => {
            invalidateLists(qc),
                locationInvalidatedLists(qc)

        }
    });
};





// Update rack
export const useUpdateRack = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RackReqDTO }) => racksAPI.update(id, data),
        onSuccess: () => {
            invalidateLists(qc),
                locationInvalidatedLists(qc)

        }
    });
};

// Update rack by user
export const useUpdateRackByUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RackReqDTO }) => racksAPI.updateForUser(id, data),
        onSuccess: () => {
            invalidateLists(qc),
                locationInvalidatedLists(qc)

        }
    });
};

// Delete rack
export const useDeleteRack = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => racksAPI.delete(id),
        onSuccess: () => {
            invalidateLists(qc),
                locationInvalidatedLists(qc)

        }
    });
};
