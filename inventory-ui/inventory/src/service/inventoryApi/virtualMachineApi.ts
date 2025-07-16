import api from '../inventoryapi';
import type { VirtualMachineReqDTO } from '../../types/requestDto';



// Virtual Machine API
export const virtualMachineAPI = {
    getAll: async () => {
        const response = await api.get('/api/v1/vm');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/vm/${id}`);
        return response.data;
    },
    getSorted: async (order: string, field: string) => {
        const response = await api.get(`/api/v1/vm/sorted?order=${order}&field=${field}`);
        return response.data;
    },
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vm/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchByName: async (name: string) => {
        const response = await api.get(`/api/v1/vm/search?name=${name}`);
        return response.data;
    },
    getVirtualMachinesByUser: async () => {
        const response = await api.get('/api/v1/vm/users');
        return response.data;
    },
    getVirtualMachineByUser: async (vmId: number) => {
        const response = await api.get(`/api/v1/vm/${vmId}/users`);
        return response.data;
    },
    getVirtualMachinesByUserPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vm/users/paged?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    searchVirtualMachinesByNamePaged: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get(`/api/v1/vm/search/${name}?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response.data;
    },
    countByUser: async () => {
        const response = await api.get('/api/v1/vm/count');
        return response.data;
    },
    isAccessibleByUser: async (vmId: number) => {
        const response = await api.get(`/api/v1/vm/access/${vmId}`);
        return response.data;
    },
    getVirtualMachineIdsByUser: async () => {
        const response = await api.get('/api/v1/vm/ids');
        return response.data;
    },
    create: async (vmData: VirtualMachineReqDTO) => {
        const response = await api.post('/api/v1/vm', vmData);
        return response.data;
    },
    addUsers: async (vmId: number, userIds: number[]) => {
        const response = await api.post(`/api/v1/vm/add-user/${vmId}`, { userIds });
        return response.data;
    },
    update: async (id: number, vmData: VirtualMachineReqDTO) => {
        const response = await api.put(`/api/v1/vm/${id}`, vmData);
        return response.data;
    },
    updateForUser: async (vmId: number, vmData: VirtualMachineReqDTO) => {
        const response = await api.put(`/api/v1/vm/${vmId}/users`, vmData);
        return response.data;
    },
    updateVirtualPlatform: async (vmId: number, vpId: number) => {
        const response = await api.patch(`/api/v1/vm/`, { vmId, vpId });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/vm/${id}`);
        return response.data;
    },
    removeUsers: async (vmId: number, userIds: number[]) => {
        const response = await api.delete(`/api/v1/vm/remove-user/${vmId}`, { data: { userIds } });
        return response.data;
    },
    deleteAllVirtualMachinesByUser: async () => {
        const response = await api.delete('/api/v1/vm/users');
        return response.data;
    },
    deleteVirtualMachineByUser: async (vmId: number) => {
        const response = await api.delete(`/api/v1/vm/${vmId}/users`);
        return response.data;
    },
};

