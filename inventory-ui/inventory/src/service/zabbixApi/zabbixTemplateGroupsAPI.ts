import api from '../inventoryapi';

export const zabbixTemplateGroupsAPI = {
    create: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/create/${projectId}`, data);
        return response.data;
    },

    delete: async (projectId: number, data: object) => {
        const response = await api.delete(`/api/v1/zabbix/templategroups/delete/${projectId}`, {
            data
        });
        return response.data;
    },

    get: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/get/${projectId}`, data);
        return response.data;
    },

    massAdd: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/massadd/${projectId}`, data);
        return response.data;
    },

    massRemove: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/massremove/${projectId}`, data);
        return response.data;
    },

    massUpdate: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/massupdate/${projectId}`, data);
        return response.data;
    },

    propagate: async (projectId: number, data: object) => {
        const response = await api.post(`/api/v1/zabbix/templategroups/propagate/${projectId}`, data);
        return response.data;
    },

    update: async (projectId: number, data: object) => {
        const response = await api.put(`/api/v1/zabbix/templategroups/update/${projectId}`, data);
        return response.data;
    }
};
