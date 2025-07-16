import api from '../inventoryapi';


export const zabbixItemsAPI = {
  create: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/items/create/${projectId}`, data);
    return response.data;
  },

  delete: async (projectId: number, itemIds: any) => {
    const response = await api.delete(`/api/v1/zabbix/items/delete/${projectId}`, {
      data: itemIds
    });
    return response.data;
  },

  get: async (projectId: number, params: object) => {
    const response = await api.get(`/api/v1/zabbix/items/get/${projectId}`, {
      data: params
    });
    return response.data;
  },

  getCount: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/items/count/${projectId}`, params);
    return response.data;
  },

  update: async (projectId: number, data: object) => {
    const response = await api.put(`/api/v1/zabbix/items/update/${projectId}`, data);
    return response.data;
  }
};
