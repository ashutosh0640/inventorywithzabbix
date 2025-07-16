import api from '../inventoryapi';

export const zabbixProblemsAPI = {
  get: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/problems/get/${projectId}`, data);
    return response.data;
  },

  getCount: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/problems/count/${projectId}`, data);
    return response.data;
  },
}