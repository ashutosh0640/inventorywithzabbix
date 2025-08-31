import api from '../inventoryapi';
import type { ZabbixHostGroup } from '../../types/ZabbixHostGroups';

export const zabbixHostGroupsAPI = {
  create: async (projectId: number, data: object) => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/create/${projectId}`, data);
    return response.data;
  },

  delete: async (projectId: number, ids: any) => {
    const response = await api.delete(`/api/v1/zabbix/hostgroups/delete/${projectId}`, {
      data: ids
    });
    return response.data;
  },

  get: async(projectId: number, params: object): Promise<ZabbixHostGroup[]> => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/get/${projectId}`, params);
    return response.data.result as ZabbixHostGroup[];
  },

  massAdd: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/massadd/${projectId}`, params);
    return response.data;
  },

  massRemove: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/massremove/${projectId}`, params);
    return response.data;
  },

  massUpdate: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/massupdate/${projectId}`, params);
    return response.data;
  },

  propagate: async (projectId: number, params: object) => {
    const response = await api.post(`/api/v1/zabbix/hostgroups/propagate/${projectId}`, params);
    return response.data;
  },

  update: async (projectId: number, data: object) => {
    const response = await api.put(`/api/v1/zabbix/hostgroups/update/${projectId}`, data);
    return response.data;
  }
};
