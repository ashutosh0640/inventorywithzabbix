import { useQuery } from '@tanstack/react-query';
import { permissionAPI } from '../../service/inventoryapi';


export const usePermissions = () => {
    return useQuery<Permissions[], Error>({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await permissionAPI.getAll();
            return response;
        }
    })
}

export const usePermissionById = (permissionId: number) => {
    return useQuery<Permissions, Error>({
        queryKey: ['permission', permissionId],
        queryFn: async () => {
            const response = await permissionAPI.getById(permissionId);
            return response;
        },
        enabled: !!permissionId
    });
}

