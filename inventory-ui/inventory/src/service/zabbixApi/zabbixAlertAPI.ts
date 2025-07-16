import inventoryapi from '../inventoryapi';

export const zabbixAlertsAPI = {
  get: async (projectId: number, params: object) => {
    const response = await inventoryapi.post(`/api/zabbix/alerts/get/${projectId}`, params);
    return response.data;
  }
};
