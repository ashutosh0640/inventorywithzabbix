import { useQuery } from '@tanstack/react-query';
import { rolesAPI } from '../../service/inventoryapi';
import type { Role } from '../../types/responseDto';


export const useRoles = () => {
    return useQuery<Role[], Error>({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await rolesAPI.getAll();
            return response;
        }
    })
}


export const useRoleById = (roleId: number) => {
    return useQuery<Role, Error>({
        queryKey: ['role', roleId],
        queryFn: async () => {
            const response = await rolesAPI.getById(roleId);
            return response;
        },
        enabled: !!roleId
    });
}


export const useSortedRoles = (order: string, field: string) => {
    return useQuery<Role[], Error>({
        queryKey: ['roles', 'sorted', order, field],
        queryFn: async () => {
            const response = await rolesAPI.getSorted(order, field);
            return response;
        },
        enabled: !!order && !!field
    });
}


export const usePagedRoles = (pageSize: number, pageNumber: number) => {
    return useQuery<Role[], Error>({
        queryKey: ['roles', 'paged', pageSize, pageNumber],
        queryFn: async () => {
            const response = await rolesAPI.getPaged(pageSize, pageNumber);
            return response;
        },
        enabled: !!pageSize && !!pageNumber
    });
}


export const useSearchRolesByName = (name: string) => {
    return useQuery<Role[], Error>({
        queryKey: ['roles', 'search', name],
        queryFn: async () => {
            const response = await rolesAPI.searchByName(name);
            return response;
        },
        enabled: !!name
    });
}


