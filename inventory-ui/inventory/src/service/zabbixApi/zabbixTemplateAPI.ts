import api from '../inventoryapi';


export const zabbixTemplatesAPI = {
    create: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/create/${projectId}`, data);
        return response.data;
    },

    update: async (projectId: number, data: object) => {
        const response = await api.put(`/api/v1/zabbix/templates/update/${projectId}`, data);
        return response.data;
    },

    delete: async (projectId: number, templateIds: string[]) => {
        const response = await api.delete(`/api/v1/zabbix/templates/delete/${projectId}`, {
            data: templateIds,
        });
        return response.data;
    },

    get: async (projectId: number, params: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/get/${projectId}`, params);
        return response.data;
    },

    getCount: async (projectId: number, params: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/count/${projectId}`, params);
        return response.data;
    },

    massAdd: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/massadd/${projectId}`, data);
        return response.data;
    },

    massRemove: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/massremove/${projectId}`, data);
        return response.data;
    },

    massUpdate: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templates/massupdate/${projectId}`, data);
        return response.data;
    }
};
