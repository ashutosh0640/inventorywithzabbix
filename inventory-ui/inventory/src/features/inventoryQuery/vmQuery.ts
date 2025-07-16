import { useQuery } from '@tanstack/react-query';
import { virtualMachineAPI } from '../../service/inventoryapi';
import type { VirtualMachine } from '../../types/responseDto';


export const useVM = () => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm'],
        queryFn: async () => {
            const response = await virtualMachineAPI.getAll();
            return response;
        }
    });
}


export const useVMById = (vmId: number) => {
    return useQuery<VirtualMachine, Error>({
        queryKey: ['vm', vmId],
        queryFn: async () => {
            const response = await virtualMachineAPI.getById(vmId);
            return response;
        },
        enabled: !!vmId
    });
}


export const useSortedVMs = (sort: string, field: string) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'sorted'],
        queryFn: async () => {
            const response = await virtualMachineAPI.getSorted(sort, field);
            return response;
        }
    });
}

export const usePagedVMs = (pageSize: number, pageNumber: number) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'paged', pageSize, pageNumber],
        queryFn: async () => {
            const response = await virtualMachineAPI.getPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchVMsByName = (name: string, pageSize: number, pageNumber: number) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'search', name, pageSize, pageNumber],
        queryFn: async () => {
            const response = await virtualMachineAPI.searchByName(name);
            return response;
        },
        enabled: !!name && !!pageSize && !!pageNumber
    });
}


export const useVMsByUser = (id: number) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'byUser', id],
        queryFn: async () => {
            const response = await virtualMachineAPI.getVirtualMachinesByUser();
            return response;
        }
    });
}

export const useVMByUser = (vmId: number, id: number) => {
    return useQuery<VirtualMachine, Error>({
        queryKey: ['vm', 'byUser', vmId, id],
        queryFn: async () => {
            const response = await virtualMachineAPI.getVirtualMachineByUser(vmId);
            return response;
        },
        enabled: !!vmId
    });
}


export const useVMsByUserPaged = (pageSize: number, pageNumber: number, id: number) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'byUser', 'paged', pageSize, pageNumber, id],
        queryFn: async () => {
            const response = await virtualMachineAPI.getVirtualMachinesByUserPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchVMsByNamePaged = (name: string, pageSize: number, pageNumber: number, id: number) => {
    return useQuery<VirtualMachine[], Error>({
        queryKey: ['vm', 'search', name, 'paged', pageSize, pageNumber, id],
        queryFn: async () => {
            const response = await virtualMachineAPI.searchVirtualMachinesByNamePaged(name, pageSize, pageNumber);
            return response;
        },
        enabled: !!name && !!pageSize && !!pageNumber
    });
}


export const useVMsCountByUser = (id: number) => {
    return useQuery<number, Error>({
        queryKey: ['vmCount', 'ByUser', id],
        queryFn: async () => {
            const response = await virtualMachineAPI.countByUser();
            return response;
        }
    });
}