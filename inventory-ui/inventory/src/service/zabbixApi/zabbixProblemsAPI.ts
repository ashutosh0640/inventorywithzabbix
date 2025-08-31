import api from '../inventoryapi';
import type { ZabbixProblem, ZabbixProblemGetParams } from '../../types/zabbixProblem';

export const zabbixProblemsAPI = {
  get: async (projectId: number, params: ZabbixProblemGetParams) => {
    const response = await api.post(`/api/v1/zabbix/problems/get/${projectId}`, params);
    return response.data.result as ZabbixProblem[];
  },

  getCount: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/problems/count/${projectId}`, params);
    return response.data;
  },
}