import api from '../inventoryapi';

// zabbixUsersAPI.ts
export const zabbixUsersAPI = {
    checkAuthentication: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/check-authentication/${projectId}`, data);
        return response.data;
    },
    create: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/create/${projectId}`, data);
        return response.data;
    },
    delete: async (projectId: number, data: object) => {
        const response = await api.delete(`/api/v1/zabbix/users/delete/${projectId}`, { data });
        return response.data;
    },
    get: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/get/${projectId}`, data);
        return response.data;
    },

    getCount: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/count/${projectId}`, data);
        return response.data;
    },

    login: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/login/${projectId}`, data);
        return response.data;
    },
    logout: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/logout/${projectId}`, data);
        return response.data;
    },
    provision: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/provision/${projectId}`, data);
        return response.data;
    },
    resetTotp: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/resettotp/${projectId}`, data);
        return response.data;
    },
    unblock: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/users/unblock/${projectId}`, data);
        return response.data;
    },
    update: async (projectId: number, data: object) => {
        const response = await api.put(`/api/v1/zabbix/users/update/${projectId}`, data);
        return response.data;
    },
};
