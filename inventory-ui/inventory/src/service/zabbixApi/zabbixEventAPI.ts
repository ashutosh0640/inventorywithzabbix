import api from '../inventoryapi';

export const zabbixEventsAPI = {
  get: async (projectId: number, params: object) => {
    const response = await api.get(`/api/v2/zabbix/event/get`, {
      params: { projectId, ...params }
    });
    return response.data;
  },

  acknowledge: async (projectId: number, params: object) => {
    const response = await api.get(`/api/v2/zabbix/event/acknowledge`, {
      params: { projectId, ...params }
    });
    return response.data;
  }
};
