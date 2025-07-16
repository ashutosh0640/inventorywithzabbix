import api from '../inventoryapi';
import type { RoleReqDTO } from '../../types/requestDto';




// Role API
export const rolesAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/role');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/role/${id}`);
        return response.data;
    },
    getSorted: async (order: string, field: string) => {
        const response = await api.get(`/api/v1/role/sorted?order=${order}&field=${field}`);
        return response.data;
    },
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/role/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchByName: async (name: string) => {
        const response = await api.get(`/api/v1/role/search/by-name?name=${name}`);
        return response.data;
    },
    create: async (roleData: RoleReqDTO) => {
        const response = await api.post('/api/v1/role', roleData);
        return response.data;
    },
    createBatch: async (roleDataList: RoleReqDTO[], batchSize: number) => {
        const response = await api.post('/api/v1/role/batch', { roleDataList, batchSize });
        return response.data;
    },
    addPermissions: async (roleId: number, permissionIds: Set<number>) => {
        const response = await api.post('/api/v1/role/add-permission', { roleId, permissionIds });
        return response.data;
    },
    update: async (id: number, roleData: RoleReqDTO) => {
        const response = await api.put(`/api/v1/role/${id}`, roleData);
        return response.data;
    },
    updatePermissions: async (roleId: number, permissionIds: Set<number>) => {
        const response = await api.patch(`/api/v1/role/update-permission`, { roleId, permissionIds });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/role/delete`, { data: { id } });
        return response.data;
    },
    removePermissions: async (roleId: number, permissionIds: number[]) => {
        const response = await api.delete(`/api/v1/role/remove-permission`, { data: { roleId, permissionIds } });
        return response.data;
    },
};
