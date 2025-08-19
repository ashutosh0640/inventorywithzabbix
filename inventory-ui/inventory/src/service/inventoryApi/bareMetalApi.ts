import api from '../inventoryapi';
import type { BareMetalReqDTO } from '../../types/requestDto';

// Baremetal API
export const baremetalsAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/baremetal');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/baremetal/${id}`);
        return response.data;
    },
    getSorted: async (sort: string, field: string) => {
        const response = await api.get(`/api/v1/baremetal/sorted?sort=${sort}&field=${field}`);
        return response.data;
    },
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/baremetal/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchByNamePaged: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/baremetal/search/by-name/paged?name=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    getBareMetalServersByUser: async () => {
        const response = await api.get('/api/v1/baremetal/users');
        return response.data;
    },
    getBareMetalServerByUser: async (baremetalId: number) => {
        const response = await api.get(`/api/v1/baremetal/${baremetalId}/users`);
        return response.data;
    },
    getBareMetalServerByIdsAndUser: async (ids: number[]) => {
        const response = await api.post('/api/v1/baremetal/users/ids', ids);
        return response.data;
    },
    findBySerialNumber: async (sno: string) => {
        const response = await api.get(`/api/v1/baremetal/search/by-sno?sno=${sno}`);
        return response.data;
    },
    findByServerName: async (name: string) => {
        const response = await api.get(`/api/v1/baremetal/search/by-name?name=${name}`);
        return response.data;
    },
    findByModel: async (model: string) => {
        const response = await api.get(`/api/v1/baremetal/search/by-model?model=${model}`);
        return response.data;
    },
    findByRackAndUser: async (rackId: number) => {
        const response = await api.get(`/api/v1/baremetal/rack/${rackId}`);
        return response.data;
    },
    countByUser: async () => {
        const response = await api.get('/api/v1/baremetal/count');
        return response.data;
    },
    getBareMetalServersByUserPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/baremetal/users/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    isAccessibleByUser: async (baremetalId: number) => {
        const response = await api.get(`/api/v1/baremetal/access/users/${baremetalId}`);
        return response.data;
    },
    getBareMetalServerIdsByUser: async () => {
        const response = await api.get('/api/v1/baremetal/id');
        return response.data;
    },
    create: async (baremetalData: BareMetalReqDTO) => {
        const response = await api.post('/api/v1/baremetal', baremetalData);
        return response.data;
    },
    createBatch: async (baremetalDataList: Set<BareMetalReqDTO>, batchSize: number) => {
        const response = await api.post('/api/v1/baremetal/batch', { baremetalDataList, batchSize });
        return response.data;
    },
    addUsers: async (baremetalId: number, userIds: number[]) => {
        const response = await api.post('/api/v1/baremetal/add-users', { baremetalId, userIds });
        return response.data;
    },
    update: async (id: number, baremetalData: BareMetalReqDTO) => {
        const response = await api.put(`/api/v1/baremetal/${id}`, baremetalData);
        return response.data;
    },
    updateForUser: async (baremetalId: number, baremetalData: BareMetalReqDTO) => {
        const response = await api.put(`/api/v1/baremetal/${baremetalId}/update`, baremetalData);
        return response.data;
    },
    updateRack: async (id: number, rackId: number) => {
        const response = await api.patch(`/api/v1/baremetal/update-rack/${id}`, { rackId });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/baremetal/${id}`);
        return response.data;
    },
    removeUsers: async (baremetalId: number, userIds: number[]) => {
        const response = await api.delete(`/api/v1/baremetal/remove-users/${baremetalId}`, { data: { userIds } });
        return response.data;
    },
    deleteAllBareMetalServersByUser: async () => {
        const response = await api.delete('/api/v1/baremetal/users');
        return response.data;
    },
};

