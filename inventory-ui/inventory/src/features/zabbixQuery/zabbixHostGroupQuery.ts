import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixHostGroupsAPI } from '../../service/zabbixApi/zabbixHostGroupAPI';
import { useProjectId } from './projectIdHook';
import type { 
  ZabbixHostGroup,
  ZabbixHostgroupGetParams,
  ZabbixHostgroupDeleteParams,
  ZabbixHostgroupCreateParams,
  HostGroupUpdateParams
} from '../../types/ZabbixHostGroups';

const HOSTGROUPS = 'HostGroups' as const;

/** e.g. queryKeys.list() ➜ ['HostGroups','list'] */
const queryKeys = {
  base: [HOSTGROUPS] as const,
  list: () => [...queryKeys.base, 'list'] as const,
};

// Get host groups
export const useGetHostGroups = (params: ZabbixHostgroupGetParams) => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useQuery<ZabbixHostGroup[]>({
    queryKey: [queryKeys.list(), projectId],
    queryFn: () => zabbixHostGroupsAPI.get(projectId, params),
    enabled: !!projectId,
  });
};


// WRITE HOOKS  (all auto‑invalidate the host group lists & details)
const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: queryKeys.base });

// Create a host group
export const useCreateHostGroup = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: (params: ZabbixHostgroupCreateParams) =>
      zabbixHostGroupsAPI.create(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};


// Delete host groups
export const useDeleteHostGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: (params: string[]) =>
      zabbixHostGroupsAPI.delete(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Update a host group
export const useUpdateHostGroup = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: (params: HostGroupUpdateParams) =>
      zabbixHostGroupsAPI.update(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Mass Add host groups
export const useMassAddHostGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixHostGroupsAPI.massAdd(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Mass Remove host groups
export const useMassRemoveHostGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixHostGroupsAPI.massRemove(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Mass Update host groups
export const useMassUpdateHostGroups = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixHostGroupsAPI.massUpdate(projectId, params),
    onSuccess: () => invalidateLists(queryClient)
  });
};

// Propagate host groups
export const usePropagateHostGroups = () => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useMutation({
    mutationFn: ({ params }: { params: object }) =>
      zabbixHostGroupsAPI.propagate(projectId, params),
    onSuccess: () => invalidateLists(useQueryClient())
  });
};
