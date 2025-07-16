import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixActionsAPI } from '../../service/zabbixApi/zabbixActionAPI';

// Create Action
export const useCreateZabbixAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixActionsAPI.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};

// Delete Action
export const useDeleteZabbixAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, actionIds }: { projectId: number; actionIds: any }) =>
      zabbixActionsAPI.delete(projectId, actionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};

// Get Actions
export const useZabbixActions = (projectId: number, params: object) => {
  return useQuery({
    queryKey: ['ZabbixActions', projectId, params],
    queryFn: () => zabbixActionsAPI.get(projectId, params),
    enabled: !!projectId
  });
};

// Update Action
export const useUpdateZabbixAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixActionsAPI.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};
