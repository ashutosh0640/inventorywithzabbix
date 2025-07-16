import { useQuery } from '@tanstack/react-query';
import { virtualPlatformsAPI } from '../../service/inventoryapi';
import type { VirtualPlatform } from '../../types/responseDto';



export const useVP = () => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms'],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getAll();
            return response;
        }
    });
}


export const useVPById = (vpId: number) => {
    return useQuery<VirtualPlatform, Error>({
        queryKey: ['VirtualPlatform', vpId],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getById(vpId);
            return response;
        },
        enabled: !!vpId
    });
}


export const useSortedVPs = (sort: string, field: string) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms', 'sorted'],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getSorted(sort, field);
            return response;
        }
    });
}


export const usePagedVPs = (pageSize: number, pageNumber: number) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms', 'paged', pageSize, pageNumber],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchVPsByName = (name: string, pageSize: number, pageNumber: number) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms', 'search', name, pageSize, pageNumber],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.searchByName(name);
            return response;
        },
        enabled: !!name && !!pageSize && !!pageNumber
    });
}

export const useVPsByUser = () => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms', 'byUser'],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformsByUser();
            return response;
        }
    });
}


export const useVPByUser = (vpId: number) => {
    return useQuery<VirtualPlatform, Error>({
        queryKey: ['VirtualPlatform', 'byUser', vpId],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformByUser(vpId);
            return response;
        },
        enabled: !!vpId
    });
}


export const useVPsByUserPaged = (pageSize: number, pageNumber: number) => {
    return useQuery<VirtualPlatform[], Error>({
        queryKey: ['VirtualPlatforms', 'byUser', 'paged', pageSize, pageNumber],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.getVirtualizationPlatformsByUserPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useVPsCountByUser = (id: number) => {
    return useQuery<number, Error>({
        queryKey: ['vpCount', 'ByUser', id],
        queryFn: async () => {
            const response = await virtualPlatformsAPI.countVirtualizationPlatformsByUser();
            return response;
        }
    });
}