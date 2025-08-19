import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { baremetalsAPI } from '../../service/inventoryapi';
import { useAppSelector } from '../../slice/hooks';
import type { BareMetalReqDTO } from '../../types/requestDto';
import type { BareMetal } from '../../types/responseDto';

// 🔁 Query Keys Helper
const queryKeys = {
    all: ['baremetals'] as const,
    byId: (id: number) => [...queryKeys.all, id] as const,
    paged: (pageSize: number, pageNumber: number) => [...queryKeys.all, 'paged', pageSize, pageNumber] as const,
    sorted: (sort: string, field: string) => [...queryKeys.all, 'sorted', sort, field] as const,
    searchByNamePaged: (name: string, pageSize: number, pageNumber: number) => [...queryKeys.all, 'search', name, pageSize, pageNumber] as const,
    users: (id: number) => [...queryKeys.all, 'users', id] as const,
    access: (baremetalId: number) => [...queryKeys.all, 'access', baremetalId] as const,
    userPaged: (pageSize: number, pageNumber: number) => [...queryKeys.all, 'userpaged', pageSize, pageNumber] as const,
};

// ✅ Queries
export const useGetAllBareMetals = () => useQuery({
    queryKey: queryKeys.all,
    queryFn: baremetalsAPI.getAll,
});

export const useGetBareMetalById = (id: number) => useQuery({
    queryKey: queryKeys.byId(id),
    queryFn: () => baremetalsAPI.getById(id),
});

export const useGetSortedBareMetals = (sort: string, field: string) => useQuery({
    queryKey: queryKeys.sorted(sort, field),
    queryFn: () => baremetalsAPI.getSorted(sort, field),
});

export const useGetPagedBareMetals = (pageSize: number, pageNumber: number) => useQuery({
    queryKey: queryKeys.paged(pageSize, pageNumber),
    queryFn: () => baremetalsAPI.getPaged(pageSize, pageNumber),
});

export const useBaremetalByNamePaged = (name: string, pageSize: number, pageNumber: number) => useQuery({
    queryKey: queryKeys.searchByNamePaged(name, pageSize, pageNumber),
    queryFn: () => baremetalsAPI.searchByNamePaged(name, pageSize, pageNumber),
});

export const useGetBareMetalByUser = () => {
    return useQuery<BareMetal[], Error>({
        queryKey: queryKeys.users(useAppSelector((state) => state.auth.loginDetails?.id || 0)),
        queryFn: baremetalsAPI.getBareMetalServersByUser,
    });
}


export const useGetBareMetalServerByUser = (baremetalId: number) => useQuery({
    queryKey: queryKeys.byId(baremetalId),
    queryFn: () => baremetalsAPI.getBareMetalServerByUser(baremetalId),
});

export const useGetBareMetalServerByIdsAndUser = (ids: number[]) => useQuery({
    queryKey: ['baremetals', 'user-ids', ...ids],
    queryFn: () => baremetalsAPI.getBareMetalServerByIdsAndUser(ids),
});

export const useGetBaremetalBySerialNumber = (sno: string) => useQuery({
    queryKey: ['baremetals', 'sno', sno],
    queryFn: () => baremetalsAPI.findBySerialNumber(sno),
});

export const useGetBaremetalByServerName = (name: string) => useQuery({
    queryKey: ['baremetals', 'name', name],
    queryFn: () => baremetalsAPI.findByServerName(name),
});

export const useGetBaremetalByModel = (model: string | null) => useQuery({
    queryKey: ['baremetals', 'model', model],
    queryFn: () => baremetalsAPI.findByModel(model!),
    enabled: model != null
});

export const useBaremetalByRackAndUser = (rackId: number | null) => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['baremetals', 'byRackAndUser', rackId],
        queryFn: () => baremetalsAPI.findByRackAndUser(rackId!),
        enabled: rackId != null
    });
}


export const useCountBaremetalByUser = () => useQuery({
    queryKey: ['baremetals', 'count'],
    queryFn: baremetalsAPI.countByUser,
});

export const useGetBareMetalServersByUserPaged = (pageSize: number, pageNumber: number) => useQuery({
    queryKey: queryKeys.userPaged(pageSize, pageNumber),
    queryFn: () => baremetalsAPI.getBareMetalServersByUserPaged(pageSize, pageNumber),
});

export const useIsBaremetalAccessibleByUser = (baremetalId: number) => useQuery({
    queryKey: queryKeys.access(baremetalId),
    queryFn: () => baremetalsAPI.isAccessibleByUser(baremetalId),
});

export const useGetBareMetalServerIdsByUser = () => useQuery({
    queryKey: ['baremetals', 'ids'],
    queryFn: baremetalsAPI.getBareMetalServerIdsByUser,
});

// ✅ Mutations
export const useCreateBareMetal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BareMetalReqDTO) => baremetalsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });
};


export const useCreateBatchBareMetal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { baremetalDataList: Set<BareMetalReqDTO>; batchSize: number }) =>
            baremetalsAPI.createBatch(data.baremetalDataList, data.batchSize),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });
}


export const useAddUsersToBareMetal = () => useMutation({
    mutationFn: (data: { baremetalId: number; userIds: number[] }) =>
        baremetalsAPI.addUsers(data.baremetalId, data.userIds),
});

export const useUpdateBareMetal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { id: number; baremetalData: BareMetalReqDTO }) =>
            baremetalsAPI.update(data.id, data.baremetalData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });
}

export const useUpdateBareMetalForUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { baremetalId: number; baremetalData: BareMetalReqDTO }) =>
            baremetalsAPI.updateForUser(data.baremetalId, data.baremetalData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });

}


export const useUpdateRack = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { id: number; rackId: number }) =>
            baremetalsAPI.updateRack(data.id, data.rackId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });
}



export const useDeleteBareMetal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => baremetalsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'paged'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['baremetals', 'count'] });

        },
    });

}



export const useRemoveUsersFromBareMetal = () => useMutation({
    mutationFn: (data: { baremetalId: number; userIds: number[] }) =>
        baremetalsAPI.removeUsers(data.baremetalId, data.userIds),
});

export const useDeleteAllBareMetalsByUser = () => useMutation({
    mutationFn: () => baremetalsAPI.deleteAllBareMetalServersByUser(),
});
