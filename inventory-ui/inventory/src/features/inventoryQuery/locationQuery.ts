import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import { locationsAPI } from '../../service/inventoryApi/locationApi';
import type { Location } from '../../types/responseDto'
import type { LocationReqDTO } from '../../types/requestDto';
import { useAppSelector } from '../../slice/hooks';
// import type { Location } from '../../types/responseDto';


const LOCATIONS = 'Locations' as const;


export const locationQueryKeys = {
    base: [LOCATIONS] as const,
    list: () => [...locationQueryKeys.base, 'list'] as const,
    paged: (p: number, s: number) => [...locationQueryKeys.base, 'paged', p, s] as const,
    search: (n: string, p: number, s: number) => [...locationQueryKeys.base, 'search', n, p, s] as const,
    sorted: () => [...locationQueryKeys.base, 'sorted'] as const,
    detail: (id: number) => [...locationQueryKeys.base, id] as const,
    userList: () => [...locationQueryKeys.base, 'user'] as const,
    counts: () => [...locationQueryKeys.base, 'counts'] as const
};

// -----------------------------------------------------------------------------
// READ HOOKS
// -----------------------------------------------------------------------------
export const useLocations = () => {

    return useQuery<Location[], Error>({
        queryKey: locationQueryKeys.list(),
        queryFn: locationsAPI.getAll
    });

}
    

export const useLocation = (id: number) =>
    useQuery({
        queryKey: locationQueryKeys.detail(id),
        queryFn: () => locationsAPI.getById(id),
        enabled: !!id
    });

export const useSortedLocations = () =>
    useQuery({ queryKey: locationQueryKeys.sorted(), queryFn: locationsAPI.getSorted });

export const usePagedLocations = (page: number, size: number) =>
    useQuery({
        queryKey: locationQueryKeys.paged(page, size),
        queryFn: () => locationsAPI.getPaged(size, page),
    });

export const useSearchLocations = (
    name: string,
    page: number,
    size: number
) =>
    useQuery({
        queryKey: locationQueryKeys.search(name, page, size),
        queryFn: () => locationsAPI.searchLocations(name, size, page),
        enabled: !!name,

    });


// find locations by user
export const useLocationsForUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<Location[], Error>({
        queryKey: [...locationQueryKeys.userList(), loginDetails?.id],
        queryFn: async () => {
            const response = await locationsAPI.getLocationsForUser();
            return response;
        }
    })
}

export const useLocationsForUserPaged = (page: number, size: number) =>
    useQuery({
        queryKey: [...locationQueryKeys.userList(), 'paged', page, size],
        queryFn: () => locationsAPI.getLocationsforUserPaged(size, page),
    });

export const useLocationIdsForUser = () =>
    useQuery({
        queryKey: [...locationQueryKeys.userList(), 'ids'],
        queryFn: locationsAPI.getLocationIdsForUser
    });

export const useLocationCountByUser = () =>
    useQuery({
        queryKey: [...locationQueryKeys.userList(), 'count'],
        queryFn: locationsAPI.countByUser
    });

export const useLocationStats = () =>
    useQuery({
        queryKey: locationQueryKeys.counts(),
        queryFn: locationsAPI.getCountLocationResource
    });

export const useLocationAccess = (id: number) =>
    useQuery({
        queryKey: [...locationQueryKeys.detail(id), 'access'],
        queryFn: () => locationsAPI.isLocationAccessible(id),
        enabled: !!id
    });

// -----------------------------------------------------------------------------
// WRITE HOOKS (mutations) with automatic cache invalidation
// -----------------------------------------------------------------------------
const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: locationQueryKeys.base });

export const useCreateLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: LocationReqDTO) => locationsAPI.create(dto),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useCreateLocationsBatch = (batchSize: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dtoList: LocationReqDTO[]) =>
            locationsAPI.createBatch(dtoList, batchSize),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useUpdateLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: LocationReqDTO }) =>
            locationsAPI.update(id, dto),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useUpdateLocationForUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: LocationReqDTO }) =>
            locationsAPI.updateForUser(id, dto),
        onSuccess: () => invalidateLists(qc)
    });
};

// ---------- PATCH‑like helpers for users -------------------------------------
const usePatchUsers = (
    action: 'add' | 'remove',
    apiFn: (id: number, users: Set<number>) => Promise<any>
) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userIds }: { id: number; userIds: Set<number> }) =>
            apiFn(id, userIds),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useAddUsersToLocation = () =>
    usePatchUsers('add', locationsAPI.addUsersToLocation);
export const useRemoveUsersFromLocation = () =>
    usePatchUsers('remove', locationsAPI.removeUsersFromLocation);

// ---------- DELETE hooks -----------------------------------------------------
export const useDeleteLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => locationsAPI.delete(id),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useDeleteLocationsByUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => locationsAPI.deleteAllByUser(),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useDeleteLocationForUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => locationsAPI.deleteForUser(id),
        onSuccess: () => invalidateLists(qc)
    });
};
