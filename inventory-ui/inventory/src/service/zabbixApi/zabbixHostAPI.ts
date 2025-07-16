import api from '../inventoryapi';

export const zabbixHostsAPI = {
  create: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/create/${projectId}`, data);
    return response.data;
  },

  delete: async (projectId: number, hostIds: [number]) => {
    const response = await api.delete(`/api/v1/zabbix/hosts/delete/${projectId}`, {
      data: hostIds
    });
    return response.data;
  },

  get: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/get/${projectId}`, params);
    return response.data;
  },

  getCount: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/count/${projectId}`, params);
    return response.data;
  },

  massAdd: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/massadd/${projectId}`, params);
    return response.data;
  },

  massRemove: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/massremove/${projectId}`, params);
    return response.data;
  },

  massUpdate: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hosts/massupdate/${projectId}`, params);
    return response.data;
  },

  update: async (projectId: number, data: object) => {
    const response = await api.put(`/api/v1/zabbix/hosts/update/${projectId}`, data);
    return response.data;
  }
};
