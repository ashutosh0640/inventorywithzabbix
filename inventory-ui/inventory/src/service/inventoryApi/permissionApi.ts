import api from '../inventoryapi';
import type { PermissionReqDTO } from '../../types/requestDto';



// Permission API
export const permissionAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/permission');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/permission/${id}`);
        return response.data;
    },
    create: async (permissionData: PermissionReqDTO) => {
        const response = await api.post('/api/v1/permission', permissionData);
        return response.data;
    },
    createBatch: async (permissionList: PermissionReqDTO[]) => {
        const response = await api.post('/api/v1/permission/batch', permissionList);
        return response.data;
    },
    addPermissionsToRole: async (roleId: number, permissionIds: Set<number>) => {
        const response = await api.post('/api/v1/permission/add-permission/roles', {
            roleId,
            permissionIds,
        });
        return response.data;
    },
    removePermissionsFromRole: async (roleId: number, permissionIds: Set<number>) => {
        const response = await api.delete('/api/v1/permission/remove', {
            data: { roleId, permissionIds },
        });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/permission/${id}`);
        return response.data;
    },
};

