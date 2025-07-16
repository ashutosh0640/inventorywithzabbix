import { useQuery, useMutation } from '@tanstack/react-query';
import { zabbixTriggersAPI } from '../../service/zabbixApi/zabbixTriggerAPI';

// Fetch triggers
export const useGetZabbixTriggers = (projectId: number, params: object) => {
  return useQuery({
    queryKey: ['zabbixTriggers', projectId, params],
    queryFn: () => zabbixTriggersAPI.get(projectId, params),
  });
};

// Fetch trigger count
export const useGetZabbixTriggerCount = (projectId: number, params: object) => {
  return useQuery({
    queryKey: ['zabbixTriggersCount', projectId, params],
    queryFn: () => zabbixTriggersAPI.getCount(projectId, params),
  });
};

// Create trigger
export const useCreateZabbixTrigger = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTriggersAPI.create(projectId, data),
  });
};

// Update trigger
export const useUpdateZabbixTrigger = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTriggersAPI.update(projectId, data),
  });
};

// Delete trigger(s)
export const useDeleteZabbixTriggers = () => {
  return useMutation({
    mutationFn: ({ projectId, triggerIds }: { projectId: number; triggerIds: any }) =>
      zabbixTriggersAPI.delete(projectId, triggerIds),
  });
};
