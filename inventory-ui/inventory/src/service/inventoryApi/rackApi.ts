import api from '../inventoryapi';
import type { RackReqDTO } from '../../types/requestDto';
import type { Rack, Page } from '../../types/responseDto';



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
    getPaged: async (page: number, size: number): Promise<Page<Rack>> => {
        const response = await api.get(`/api/v1/rack/paged?page=${page}&size=${size}`);
        return response.data;
    },
    searchByName: async (name: string) => {
        const response = await api.get(`/api/v1/rack/search?name=${name}`);
        return response.data;
    },
    searchByNamePaged: async (name: string, page: number, size: number): Promise<Page<Rack>> => {
        const response = await api.get(`/api/v1/rack/search/by-name/paged?name=${name}&page=${page}&size=${size}`);
        return response.data;
    },
    getRacksByIdForUser: async (id: number): Promise<Rack> =>{
        const response = await api.get(`/api/v1/rack/${id}/users`);
        return response.data;
    },
    getRacksForUser: async () => {
        const response = await api.get('/api/v1/rack/users');
        return response.data;
    },
    getRacksByLocationForUser: async (locationId: number): Promise<Rack[]> => {
        const response = await api.get(`/api/v1/rack/user/location/${locationId}`);
        return response.data;
    },
    getRacksForUserPaged: async (page: number, size: number): Promise<Page<Rack>> => {
        const response = await api.get(`/api/v1/rack/users/paged?page=${page}&size=${size}`);
        return response.data;
    },
    countByUser: async () => {
        const response = await api.get('/api/v1/rack/count');
        return response.data;
    },
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

