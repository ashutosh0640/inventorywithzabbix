import { useQuery, useMutation } from '@tanstack/react-query';
import { zabbixTemplateGroupsAPI } from '../../service/zabbixApi/zabbixTemplateGroupsAPI';

// Fetch template groups
export const useGetZabbixTemplateGroups = (projectId: number, data: object) => {
  return useQuery({
    queryKey: ['zabbixTemplateGroups', projectId, data],
    queryFn: () => zabbixTemplateGroupsAPI.get(projectId, data),
  });
};

// Create template group
export const useCreateZabbixTemplateGroup = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.create(projectId, data),
  });
};

// Update template group
export const useUpdateZabbixTemplateGroup = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.update(projectId, data),
  });
};

// Delete template group
export const useDeleteZabbixTemplateGroup = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.delete(projectId, data),
  });
};

// Mass Add template groups
export const useMassAddZabbixTemplateGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.massAdd(projectId, data),
  });
};

// Mass Remove template groups
export const useMassRemoveZabbixTemplateGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.massRemove(projectId, data),
  });
};

// Mass Update template groups
export const useMassUpdateZabbixTemplateGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.massUpdate(projectId, data),
  });
};

// Propagate template groups
export const usePropagateZabbixTemplateGroups = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixTemplateGroupsAPI.propagate(projectId, data),
  });
};
