import { useQuery, useMutation } from '@tanstack/react-query';
import { zabbixHostGroupsAPI } from '../../service/zabbixApi/zabbixHostGroupAPI';

// Get host groups
export const useGetHostGroups = (projectId: number, params: object) => {
  return useQuery({
    queryKey: ['hostgroups', projectId, params],
    queryFn: () => zabbixHostGroupsAPI.get(projectId, params),
  });
};

// Create a host group
export const useCreateHostGroup = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixHostGroupsAPI.create(projectId, data),
  });
};

// Delete host groups
export const useDeleteHostGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, ids }: { projectId: number; ids: any }) =>
      zabbixHostGroupsAPI.delete(projectId, ids),
  });
};

// Update a host group
export const useUpdateHostGroup = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixHostGroupsAPI.update(projectId, data),
  });
};

// Mass Add host groups
export const useMassAddHostGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, params }: { projectId: number; params: object }) =>
      zabbixHostGroupsAPI.massAdd(projectId, params),
  });
};

// Mass Remove host groups
export const useMassRemoveHostGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, params }: { projectId: number; params: object }) =>
      zabbixHostGroupsAPI.massRemove(projectId, params),
  });
};

// Mass Update host groups
export const useMassUpdateHostGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, params }: { projectId: number; params: object }) =>
      zabbixHostGroupsAPI.massUpdate(projectId, params),
  });
};

// Propagate host groups
export const usePropagateHostGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, params }: { projectId: number; params: object }) =>
      zabbixHostGroupsAPI.propagate(projectId, params),
  });
};
