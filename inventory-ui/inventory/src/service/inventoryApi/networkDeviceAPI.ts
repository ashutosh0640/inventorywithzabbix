import api from '../inventoryapi';
import type { NetworkDeviceDTO } from '../../types/requestDto';

export const networkDeviceAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/network-devices');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/api/v1/network-devices/${id}`);
        return response.data;
    },

    getByIp: async (ip: string) => {
        const response = await api.get(`/api/v1/network-devices/ip`, {
            params: { ip },
        });
        return response.data;
    },

    getAllSorted: async () => {
        const response = await api.get('/api/v1/network-devices/sorted');
        return response.data;
    },

    getAllPaginated: async (page = 0, size = 5) => {
        const response = await api.get('/api/v1/network-devices/paged', {
            params: { page, size },
        });
        return response.data;
    },

    create: async (data: NetworkDeviceDTO) => {
        const response = await api.post('/api/v1/network-devices', data);
        return response.data;
    },

    createBatch: async (data: NetworkDeviceDTO[]) => {
        const response = await api.post('/api/v1/network-devices/batch', data);
        return response.data;
    },

    update: async (id: number, data: NetworkDeviceDTO) => {
        const response = await api.put(`/api/v1/network-devices/${id}`, data);
        return response.data;
    },

    updateByRack: async (id: number, rackId: number, slot: number) => {
        const response = await api.patch(`/api/v1/network-devices/${id}/update`, null, {
            params: { rackId, slot },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/network-devices/${id}`);
        return response.data;
    },

    searchByNamePaged: async (name: string, page = 0, size = 5) => {
        const response = await api.get('/api/v1/network-devices/search/by-name/paged', {
            params: { name, page, size },
        });
        return response.data;
    },

    addUsers: async (id: number, userIds: number[]) => {
        const response = await api.post(`/api/v1/network-devices/${id}/add-users`, userIds);
        return response.data;
    },

    removeUsers: async (id: number, userIds: number[]) => {
        const response = await api.delete(`/api/v1/network-devices/${id}/remove-users`, {
            data: userIds,
        });
        return response.data;
    },

    getAllByUsers: async () => {
        const response = await api.get('/api/v1/network-devices/users');
        return response.data;
    },

    getByUsers: async (id: number) => {
        const response = await api.get(`/api/v1/network-devices/${id}/users`);
        return response.data;
    },

    getDevicesForUserByIds: async (ids: number[]) => {
        const response = await api.post('/api/v1/network-devices/users/ids', ids);
        return response.data;
    },

    getByIpAndUser: async (ip: string, userId: number) => {
        const response = await api.get('/api/v1/network-devices/ip/user', {
            params: { ip, userId },
        });
        return response.data;
    },

    searchBySno: async (sNo: string) => {
        const response = await api.get('/api/v1/network-devices/search/by-sno', {
            params: { sNo },
        });
        return response.data;
    },

    searchByName: async (name: string) => {
        const response = await api.get('/api/v1/network-devices/search/by-name', {
            params: { name },
        });
        return response.data;
    },

    searchByModel: async (model: string) => {
        const response = await api.get('/api/v1/network-devices/search/by-model', {
            params: { name: model },
        });
        return response.data;
    },

    getByRackAndUser: async (rackId: number) => {
        const response = await api.get(`/api/v1/network-devices/rack/${rackId}`);
        return response.data;
    },

    removeAllForUser: async () => {
        const response = await api.delete('/api/v1/network-devices/users');
        return response.data;
    },

    deleteByUsers: async (id: number) => {
        const response = await api.delete(`/api/v1/network-devices/${id}/users`);
        return response.data;
    },

    updateByUsers: async (id: number, data: NetworkDeviceDTO) => {
        const response = await api.put(`/api/v1/baremetal/${id}/update`, data);
        return response.data;
    },

    countByUsers: async () => {
        const response = await api.get('/api/v1/network-devices/count');
        return response.data;
    },

    getAllByUsersPaged: async (page = 0, size = 5) => {
        const response = await api.get('/api/v1/network-devices/users/paged', {
            params: { page, size },
        });
        return response.data;
    },

    isAccessibleByUser: async (id: number) => {
        const response = await api.get('/api/v1/network-devices/access/users', {
            params: { id },
        });
        return response.data;
    },

    getIdsByUsers: async () => {
        const response = await api.get('/api/v1/network-devices/id');
        return response.data;
    },
};
