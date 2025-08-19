import api from '../inventoryapi';
import type { ZabbixServerReqDTO, ZabbixServerResDTO } from '../../types/zabbix';



export const zabbixServerAPI = {
  save: async (dto: ZabbixServerReqDTO): Promise<ZabbixServerResDTO> => {
    const response = await api.post('/api/v1/zabbix/server', dto);
    return response.data;
  },

  saveAll: async (dtos: Set<ZabbixServerReqDTO>): Promise<void> => {
    await api.post('/api/v1/zabbix/server/save', Array.from(dtos));
  },

  getById: async (id: number): Promise<ZabbixServerResDTO> => {
    const response = await api.get(`/api/v1/zabbix/server/id`, {
      params: { id },
    });
    return response.data;
  },

  getByName: async (name: string): Promise<ZabbixServerResDTO> => {
    const response = await api.get(`/api/v1/zabbix/server/name`, {
      params: { name },
    });
    return response.data;
  },

  getAllByUser: async (): Promise<ZabbixServerResDTO[]> => {
    const response = await api.get(`/api/v1/zabbix/server/user`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get('/api/v1/zabbix/server/count');
    return response.data;
  },

  getOnlineCount: async (): Promise<number> => {
    console.log('Fetching online Zabbix server count...');
    const response = await api.get('/api/v1/zabbix/server/count/online');
    return response.data;
  },


  findByProjectAndUser: async (): Promise<ZabbixServerResDTO[]> => {
    const response = await api.get(`/api/v1/zabbix/server/project`);
    return response.data;
  },

  findByProjectIdAndUserId: async (projectId: number): Promise<ZabbixServerResDTO> => {
    const response = await api.get(`/api/v1/zabbix/server/project`, {
      params: { projectId },
    });
    return response.data;
  },

  getAll: async (): Promise<Set<ZabbixServerResDTO>> => {
    const response = await api.get(`/api/v1/zabbix/server`);
    return response.data;
  },

  update: async (id: number, dto: ZabbixServerReqDTO): Promise<ZabbixServerResDTO> => {
    const response = await api.put(`/api/v1/zabbix/server`, dto, {
      params: { id },
    });
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/zabbix/server/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await api.delete(`/api/v1/zabbix/server`);
  },
};
