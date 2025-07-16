import api from '../inventoryapi';

export const zabbixActionsAPI = {
  create: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/actions/create/${projectId}`, data);
    return response.data;
  },

  delete: async (projectId: number, actionIds: any) => {
    const response = await api.delete(`/api/v1/zabbix/actions/delete/${projectId}`, {
      data: actionIds
    });
    return response.data;
  },

  get: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/actions/get/${projectId}`, params);
    return response.data;
  },

  update: async (projectId: number, data: object) => {
    const response = await api.put(`/api/v1/zabbix/actions/update/${projectId}`, data);
    return response.data;
  }
};
