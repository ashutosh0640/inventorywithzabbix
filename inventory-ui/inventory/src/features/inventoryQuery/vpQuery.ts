import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import { virtualPlatformsAPI } from '../../service/inventoryapi';
import type { VirtualPlatform } from '../../types/responseDto';
import { useAppSelector } from '../../slice/hooks';
import type { VirtualPlatformReqDTO } from '../../types/requestDto';

const VP = 'vp' as const;

const queryKeys = {
    base: [VP] as const,
    list: () => [...queryKeys.base, 'list'] as const,
    paged: (p: number, s: number) => [...queryKeys.base, 'paged', p, s] as const,
    search: (n: string, p: number, s: number) => [...queryKeys.base, 'search', n, p, s] as const,
    sorted: () => [...queryKeys.base, 'sorted'] as const,
    detail: (id: number | string) => [...queryKeys.base, id] as const,
    userList: () => [...queryKeys.base, 'user'] as const,
    counts: () => [...queryKeys.base, 'counts'] as const
};

export const useVP = () => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: queryKeys.list(),
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getAll();
            return response;
        }
    });
}


export const useVPById = (vpId: number) => {
    return useQuery<VirtualPlatform, Error>({
        queryKey: queryKeys.detail(vpId),
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getById(vpId);
            return response;
        },
        enabled: !!vpId
    });
}


export const useSortedVPs = (sort: string, field: string) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: [queryKeys.sorted(), sort, field],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getSorted(sort, field);
            return response;
        }
    });
}


export const usePagedVPs = (pageNumber: number, pageSize: number) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: queryKeys.paged(pageNumber, pageSize),
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getPaged(pageNumber, pageSize);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchVPsByName = (name: string) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: queryKeys.detail(name),
        queryFn: async () => {
            const response = await virtualPlatformsAPI.searchByName(name);
            return response;
        },
        enabled: !!name
    });
}

export const useVPsByUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<VirtualPlatform[], Error>({
        queryKey: [queryKeys.list, loginDetails?.id],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformsByUser();
            return response;
        }
    });
}


export const useVPByUser = (vpId: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<VirtualPlatform, Error>({
        queryKey: [queryKeys.detail(vpId), loginDetails?.id],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformByUser(vpId);
            return response;
        },
        enabled: !!vpId
    });
}


export const useVPsByUserPaged = (pageNumber: number, pageSize: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<VirtualPlatform[], Error>({
        queryKey: [queryKeys.paged(pageNumber, pageSize), loginDetails?.id],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformsByUserPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useVPsCountByUser = (id: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<number, Error>({
        queryKey: [queryKeys.counts, loginDetails?.id],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.countVirtualizationPlatformsByUser();
            return response;
        }
    });
}


export const useIsVPAccessibleByUser = (vpId: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<boolean, Error>({
        queryKey: [queryKeys.base, "access", vpId, loginDetails?.id],
        queryFn: () => virtualPlatformsAPI.isAccessibleByUser(vpId),
        enabled: !!vpId,
    });
};

export const useVPIdsByUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<number[], Error>({
        queryKey: [queryKeys.list, "ids", loginDetails?.id],
        queryFn: () => virtualPlatformsAPI.getVirtualizationPlatformIdsByUser(),
        enabled: !!loginDetails?.id,
    });
};



const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: queryKeys.base });

export const useCreateVP = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vpData: VirtualPlatformReqDTO) => virtualPlatformsAPI.create(vpData),
        onSuccess: () => invalidateLists(queryClient)
    });
};


export const useUpdateVP = () => {
    const queryClient = useQueryClient();
    return useMutation<VirtualPlatform, Error, { id: number; vpData: VirtualPlatformReqDTO }>({
        mutationFn: ({ id, vpData }) => virtualPlatformsAPI.update(id, vpData),
        onSuccess: () => invalidateLists(queryClient)
    });
};

export const useUpdateVPForUser = () => {
    const queryClient = useQueryClient();
    return useMutation<VirtualPlatform, Error, { vpId: number; vpData: VirtualPlatformReqDTO }>({
        mutationFn: ({ vpId, vpData }) => virtualPlatformsAPI.updateForUser(vpId, vpData),
        onSuccess: () => invalidateLists(queryClient)
    });
};


export const useDeleteVP = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, number>({
        mutationFn: (id) => virtualPlatformsAPI.delete(id),
        onSuccess: () => invalidateLists(queryClient)
    });
};

export const useDeleteVPByUser = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, number>({
        mutationFn: (vpId) => virtualPlatformsAPI.deleteVirtualizationPlatformByUser(vpId),
        onSuccess: () => invalidateLists(queryClient)
    });
};


export const useDeleteAllVPsByUser = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, void>({
        mutationFn: () => virtualPlatformsAPI.deleteAllVirtualizationPlatformsByUser(),
        onSuccess: () => invalidateLists(queryClient)
    });
};






export const useAddUsersToVP = () => {
    return useMutation<any, Error, { vpId: number; userIds: number[] }>({
        mutationFn: ({ vpId, userIds }) => virtualPlatformsAPI.addUsers(vpId, userIds),
    });
};

export const useRemoveUsersFromVP = () => {
    return useMutation<any, Error, { vpId: number; userIds: number[] }>({
        mutationFn: ({ vpId, userIds }) => virtualPlatformsAPI.removeUsers(vpId, userIds),
    });
};




