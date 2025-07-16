import api from '../inventoryapi';
import type { VirtualPlatformReqDTO } from '../../types/requestDto';



// Virtualization Platform API
export const virtualPlatformsAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/api/v1/vp');
            return response.data;
        } catch (error) {
            console.error("Error fetching all Virtual Platforms:", error);
            throw error;
        }
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/vp/${id}`);
        return response.data;
    },
    getSorted: async (sort: string, field: string) => {
        const response = await api.get(`/api/v1/vp/sorted?sort=${sort}&field=${field}`);
        return response.data;
    },
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vp/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchByName: async (name: string) => {
        const response = await api.get(`/api/v1/vp/search?name=${name}`);
        return response.data;
    },
    getVirtualizationPlatformsByUser: async () => {
        const response = await api.get('/api/v1/vp/users');
        return response.data;
    },
    getVirtualizationPlatformByUser: async (vpId: number) => {
        const response = await api.get(`/api/v1/vp/${vpId}/users`);
        return response.data;
    },
    getVirtualizationPlatformsByUserPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vp/users/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchVirtualizationPlatformsByNamePaged: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vp/search/paged?name=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    countVirtualizationPlatformsByUser: async () => {
        const response = await api.get('/api/v1/vp/count');
        return response.data;
    },
    isAccessibleByUser: async (vpId: number) => {
        const response = await api.get(`/api/v1/vp/access/user/${vpId}`);
        return response.data;
    },
    getVirtualizationPlatformIdsByUser: async () => {
        const response = await api.get('/api/v1/vp/ids');
        return response.data;
    },
    create: async (vpData: VirtualPlatformReqDTO) => {
        const response = await api.post('/api/v1/vp', vpData);
        return response.data;
    },
    addUsers: async (vpId: number, userIds: number[]) => {
        const response = await api.post(`/api/v1/add-users/${vpId}`, { userIds });
        return response.data;
    },
    update: async (id: number, vpData: VirtualPlatformReqDTO) => {
        const response = await api.put(`/api/v1/vp/${id}`, vpData);
        return response.data;
    },
    updateForUser: async (vpId: number, vpData: VirtualPlatformReqDTO) => {
        const response = await api.put(`/api/v1/vp/${vpId}/update`, vpData);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/vp/${id}`);
        return response.data;
    },
    removeUsers: async (vpId: number, userIds: number[]) => {
        const response = await api.delete(`/api/v1/vp/remove-users/${vpId}`, { data: { userIds } });
        return response.data;
    },
    deleteAllVirtualizationPlatformsByUser: async () => {
        const response = await api.delete('/api/v1/vp/users');
        return response.data;
    },
    deleteVirtualizationPlatformByUser: async (vpId: number) => {
        const response = await api.delete(`/api/v1/vp/${vpId}/users`);
        return response.data;
    },
};
