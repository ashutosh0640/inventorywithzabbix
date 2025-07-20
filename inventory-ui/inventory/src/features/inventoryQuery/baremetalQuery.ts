import { useQuery } from '@tanstack/react-query';
import { baremetalsAPI } from '../../service/inventoryapi';
import type { BareMetal } from '../../types/responseDto';
import { useAppSelector } from '../../slice/hooks';


export const useBaremetal = () => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals'],
        queryFn: async () => {
            const response = await baremetalsAPI.getAll();
            return response;
        }
    });
}

export const useBaremetalById = (baremetalId: number) => {
    return useQuery<BareMetal, Error>({
        queryKey: ['BareMetal', baremetalId],
        queryFn: async () => {  
            const response = await baremetalsAPI.getById(baremetalId);
            return response;
        },
        enabled: !!baremetalId
    });
}


export const useSortedBaremetals = (sort: string, field: string) => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals', 'sorted'],
        queryFn: async () => {
            const response = await baremetalsAPI.getSorted(sort, field);
            return response;
        }
    });
}


export const usePagedBaremetals = (pageSize: number, pageNumber: number) => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals', 'paged', pageSize, pageNumber],
        queryFn: async () => {
            const response = await baremetalsAPI.getPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchBaremetalsByName = (name: string, pageSize: number, pageNumber: number) => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals', 'search', name, pageSize, pageNumber],
        queryFn: async () => {
            const response = await baremetalsAPI.searchByNamePaged(name, pageSize, pageNumber);
            return response;
        },
        enabled: !!name && !!pageSize && !!pageNumber
    });
}


export const useBareMetalServersByUser = (id: number) => {
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals', 'byUser', id],
        queryFn: async () => {
            const response = await baremetalsAPI.getBareMetalServersByUser();
            return response;
        }
    });
}


export const useBareMetalServerByUser = (baremetalId: number) => {
    return useQuery<BareMetal, Error>({
        queryKey: ['BareMetal', 'byUser', baremetalId, 'user'],
        queryFn: async () => {
            const response = await baremetalsAPI.getBareMetalServerByUser(baremetalId);
            return response;
        },
        enabled: !!baremetalId
    });
}


export const useBareMetalServerBySerialNumber = (sno: string) => {
    return useQuery<BareMetal, Error>({
        queryKey: ['BareMetal', 'bySno', sno, 'serialNumber'],
        queryFn: async () => {
            const response = await baremetalsAPI.findBySerialNumber(sno);
            return response;
        },
        enabled: !!sno
    });
}

export const useBareMetalServerByName = (name: string) => {
    return useQuery<BareMetal, Error>({
        queryKey: ['BareMetal', 'byName', name, 'name'],
        queryFn: async () => {
            const response = await baremetalsAPI.findByServerName(name);
            return response;
        },
        enabled: !!name
    });
}

export const useBareMetalServerByModel = (model: string) => {
    return useQuery<BareMetal, Error>({
        queryKey: ['BareMetal', 'byModel', model, 'model'],
        queryFn: async () => {
            const response = await baremetalsAPI.findByModel(model);
            return response;
        },
        enabled: !!model
    });
}


export const useBareMetalServerByRackAndUser = (rackId: number) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<BareMetal[], Error>({
        queryKey: ['BareMetals', 'byrack', rackId, loginDetails?.id],
        queryFn: async () => {
            const response = await baremetalsAPI.findByRackAndUser(rackId);
            return response;
        },
        enabled: !!rackId
    });
}


export const useBareMetalCountByUser = (id: number) => {
    return useQuery<number, Error>({
        queryKey: ['BareMetals', 'countByUser', id],
        queryFn: async () => {
            const response = await baremetalsAPI.countByUser();
            return response;
        }
    });
}