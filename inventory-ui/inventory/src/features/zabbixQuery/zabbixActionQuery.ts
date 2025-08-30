import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixActionsAPI } from '../../service/zabbixApi/zabbixActionAPI';
import { useProjectId } from './projectIdHook';

// Create Action
export const useCreateZabbixAction = () => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixActionsAPI.create(projectId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};

// Delete Action
export const useDeleteZabbixAction = () => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ actionIds }: { actionIds: string }) =>
      zabbixActionsAPI.delete(projectId, actionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};

// Get Actions
export const useZabbixActions = (params: object) => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useQuery({
    queryKey: ['ZabbixActions', projectId, params],
    queryFn: () => zabbixActionsAPI.get(projectId, params),
    enabled: !!projectId
  });
};

// Update Action
export const useUpdateZabbixAction = () => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixActionsAPI.update(projectId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixActions'] });
    }
  });
};
