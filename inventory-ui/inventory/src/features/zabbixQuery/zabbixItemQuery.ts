import { useQuery, useMutation } from '@tanstack/react-query';
import { zabbixItemsAPI } from '../../service/zabbixApi/zabbixItemsAPI';

// Fetch Zabbix items
export const useGetZabbixItems = (projectId: number, params: object) => {
  return useQuery({
    queryKey: ['zabbixItems', projectId, params],
    queryFn: () => zabbixItemsAPI.get(projectId, params),
  });
};

// Create Zabbix item
export const useCreateZabbixItem = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixItemsAPI.create(projectId, data),
  });
};

// Delete Zabbix items
export const useDeleteZabbixItems = () => {
  return useMutation({
    mutationFn: ({ projectId, itemIds }: { projectId: number; itemIds: any }) =>
      zabbixItemsAPI.delete(projectId, itemIds),
  });
};

// Update Zabbix item
export const useUpdateZabbixItem = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixItemsAPI.update(projectId, data),
  });
};
