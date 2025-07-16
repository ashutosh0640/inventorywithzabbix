import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../../service/inventoryapi';
import type { User } from '../../types/responseDto';

export const useUsers = () => {
    return useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await usersAPI.getAll();
            return response;
        }
    });
}

export const useUserById = (userId: number) => {
    return useQuery<User, Error>({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await usersAPI.getById(userId);
            return response;
        },
        enabled: !!userId
    });
}

export const useUsersByRole = (username: string) => {
    return useQuery<User[], Error>({
        queryKey: ['users', 'byRole', username],
        queryFn: async () => {
            const response = await usersAPI.getByUsername(username);
            return response;
        },
        enabled: !!username
    });
}

export const useUserByEmail = (email: string) => {
    return useQuery<User, Error>({
        queryKey: ['user', 'byEmail', email],
        queryFn: async () => {
            const response = await usersAPI.getByEmail(email);
            return response;
        },
        enabled: !!email
    });
}

export const useUserRoleById = (userId: number) => {
    return useQuery<string, Error>({
        queryKey: ['user', 'role', userId],
        queryFn: async () => {
            const response = await usersAPI.getRoleByUserId(userId);
            return response;
        },
        enabled: !!userId
    });
}


export const useSortedUsers = () => {
    return useQuery<User[], Error>({
        queryKey: ['users', 'sorted'],
        queryFn: async () => {
            const response = await usersAPI.getSortedUsers();
            return response;
        }
    })
}

export const usePagedUsers = (page: number, size: number) => {
    return useQuery<User[], Error>({
        queryKey: ['users', 'paged', page, size],
        queryFn: async () => {
            const response = await usersAPI.getPagedUsers(page, size);
            return response;
        },
        enabled: page >= 0 && size > 0
    });
}


export const useSearchUserByFullname = (searchTerm: string) => {
    return useQuery<User[], Error>({
        queryKey: ['users', 'search', searchTerm],
        queryFn: async () => {
            const response = await usersAPI.searchUserByFullName(searchTerm);
            return response;
        },
        enabled: !!searchTerm
    });
}