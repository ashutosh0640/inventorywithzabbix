import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixTemplateGroupsAPI } from '../../service/zabbixApi/zabbixTemplateGroupsAPI';
import { useProjectId } from './projectIdHook';
import type {
  ZabbixTemplateGroup,
  TemplateGroupGetParams,
  TemplateGroupCreateParams,
  TemplateGroupDeleteParams,
  TemplateGroupUpdateParams
} from '../../types/ZabbixTemplateGroups';

const TEMPLATEGROUPS = 'TemplateGroups' as const;

/** e.g. queryKeys.list() ➜ ['TemplateGroups','list'] */
const queryKeys = {
  base: [TEMPLATEGROUPS] as const,
  list: () => [...queryKeys.base, 'list'] as const,
};

// Get template groups
export const useGetZabbixTemplateGroups = (params: TemplateGroupGetParams) => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useQuery<ZabbixTemplateGroup[]>({
    queryKey: [queryKeys.list(), projectId],
    queryFn: () => zabbixTemplateGroupsAPI.get(projectId, params),
    enabled: !!projectId,
  });
};


// WRITE HOOKS  (all auto‑invalidate the template group lists & details)
const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: queryKeys.base });

// Create template group
export const useCreateZabbixTemplateGroup = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: TemplateGroupCreateParams) =>
      zabbixTemplateGroupsAPI.create(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};


// Delete template group
export const useDeleteZabbixTemplateGroup = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: TemplateGroupDeleteParams) =>
      zabbixTemplateGroupsAPI.delete(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};


// Update template group
export const useUpdateZabbixTemplateGroup = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: TemplateGroupUpdateParams) =>
      zabbixTemplateGroupsAPI.update(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};


// Mass Add template groups
export const useMassAddZabbixTemplateGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: object) =>
      zabbixTemplateGroupsAPI.massAdd(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Mass Remove template groups
export const useMassRemoveZabbixTemplateGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: object) =>
      zabbixTemplateGroupsAPI.massRemove(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Mass Update template groups
export const useMassUpdateZabbixTemplateGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: object) =>
      zabbixTemplateGroupsAPI.massUpdate(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Propagate template groups
export const usePropagateZabbixTemplateGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch template groups');
  }
  return useMutation({
    mutationFn: (params: object) =>
      zabbixTemplateGroupsAPI.propagate(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};
