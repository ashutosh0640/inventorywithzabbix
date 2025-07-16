import api from '../inventoryapi';
import type { RackReqDTO } from '../../types/requestDto';



// Racks API
export const racksAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/rack');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/rack/${id}`);
        return response.data;
    },
    getByName: async (name: string) => {
        const response = await api.get(`/api/v1/rack/by-name?name=${name}`);
        return response.data;
    },
    getSorted: async () => {
        const response = await api.get('/api/v1/rack/sorted');
        return response.data;
    },
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/rack/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchByName: async (name: string) => {
        const response = await api.get(`/api/v1/rack/search?name=${name}`);
        return response.data;
    },
    searchByNamePaged: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/rack/search/by-name/paged?name=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    getRacksForUser: async () => {
        const response = await api.get('/api/v1/rack/users');
        return response.data;
    },
    getRacksForUserPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/rack/users/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    countByUser: async () => {
        const response = await api.get('/api/v1/rack/count');
        return response.data;
    } ,
    create: async (rackData: RackReqDTO) => {
        const response = await api.post('/api/v1/rack', rackData);
        return response.data;
    },
    createBatch: async (rackDataList: RackReqDTO[], batchSize: number) => {
        const response = await api.post('/api/v1/rack/batch', { rackDataList, batchSize });
        return response.data;
    },
    update: async (id: number, rackData: RackReqDTO) => {
        const response = await api.put(`/api/v1/rack/${id}`, rackData);
        return response.data;
    },
    updateForUser: async (id: number, rackData: RackReqDTO) => {
        const response = await api.put(`/api/v1/rack/${id}/users/update`, rackData);
        return response.data;
    },
    patchLocation: async (id: number, locationId: number) => {
        const response = await api.patch(`/api/v1/rack/update-location/${id}`, { locationId });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/rack/${id}`);
        return response.data;
    },
    deleteForUser: async (id: number) => {
        const response = await api.delete(`/api/v1/rack/${id}/users`);
        return response.data;
    },
    deleteAllRacksForUser: async () => {
        const response = await api.delete('/api/v1/rack/users');
        return response.data;
    },
};

