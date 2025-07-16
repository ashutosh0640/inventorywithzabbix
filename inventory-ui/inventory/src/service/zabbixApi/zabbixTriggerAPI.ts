import api from '../inventoryapi';

export const zabbixTriggersAPI = {
    create: async (projectId: number, data: object) => {
        const response = await api.post(`/api/zabbix/triggers/create/${projectId}`, data);
        return response.data;
    },

    delete: async (projectId: number, triggerIds: any) => {
        const response = await api.delete(`/api/zabbix/triggers/delete/${projectId}`, {
            data: triggerIds
        });
        return response.data;
    },

    get: async (projectId: number, params: object) => {
        const response = await api.post(`/api/zabbix/triggers/get/${projectId}`, params);
        return response.data;
    },

    getCount: async (projectId: number, params: object) => {
        const response = await api.post(`/api/zabbix/triggers/count/${projectId}`, params);
        return response.data;
    },

    update: async (projectId: number, data: object) => {
        const response = await api.put(`/api/zabbix/triggers/update/${projectId}`, data);
        return response.data;
    }
};
