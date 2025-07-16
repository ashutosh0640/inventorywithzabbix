import api from '../inventoryapi';

export const zabbixDashboardAPI = {
    getDetails: async (projectId: number) => {
        const response = await api.post(`/api/v1/zabbix/dashboard/details/${projectId}`);
        return response.data;
    }
}