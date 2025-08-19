import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixServerAPI } from '../../service/zabbixApi/zabbixServerAPI';
import type { ZabbixServerReqDTO, ZabbixServerResDTO } from '../../types/zabbix';
import { useAppSelector } from '../../slice/hooks';

const ZABBIX_SERVER = 'zabbix_server' as const;

const queryKeys = {
  base: [ZABBIX_SERVER] as const,
  list: () => [...queryKeys.base, 'list'] as const,
  paged: (p: number, s: number) =>
    [...queryKeys.base, 'paged', p, s] as const,
  search: (n: string, p: number, s: number) =>
    [...queryKeys.base, 'search', n, p, s] as const,
  sorted: () => [...queryKeys.base, 'sorted'] as const,
  detail: (id: number | string) => [...queryKeys.base, id] as const
};


export const useZabbixServers = () => {
  return useQuery<Set<ZabbixServerResDTO>, Error>({
    queryKey: queryKeys.list(),
    queryFn: zabbixServerAPI.getAll,
  });
};


export const useZabbixServerById = (id: number) => {
  return useQuery<ZabbixServerResDTO, Error>({
    queryKey: queryKeys.detail(id),
    queryFn: () => zabbixServerAPI.getById(id),
    enabled: !!id,
  });
};

export const useZabbixServerByName = (name: string) => {
  return useQuery<ZabbixServerResDTO, Error>({
    queryKey: queryKeys.detail(name),
    queryFn: () => zabbixServerAPI.getByName(name),
    enabled: !!name,
  });
};

export const useZabbixServersByUser = () => {
  const loginDetails = useAppSelector((state) => state.auth.loginDetails);
  return useQuery<ZabbixServerResDTO[], Error>({
    queryKey: [queryKeys.base, loginDetails?.id],
    queryFn: zabbixServerAPI.getAllByUser,
  });
};

export const useZabbixServerCount = () => {
  return useQuery<number>({
    queryKey: [queryKeys.base, 'count'],
    queryFn: zabbixServerAPI.getCount
  })
};

export const useOnlineZabbixServerCount = () => {
  return useQuery<number>({
    queryKey: [queryKeys.base, 'count', 'online'],
    queryFn: () => zabbixServerAPI.getOnlineCount(),
  });
};


export const useZabbixServerByProjectIdAndUser = (projectId: number) => {
  const loginDetails = useAppSelector((state) => state.auth.loginDetails);
  return useQuery<ZabbixServerResDTO, Error>({
    queryKey: [queryKeys.base, projectId, loginDetails?.id],
    queryFn: () => zabbixServerAPI.findByProjectIdAndUserId(projectId),
    enabled: !!projectId,
  });
};


export const useZabbixServersByProductAndUser = () => {
  const loginDetails = useAppSelector((state) => state.auth.loginDetails);
  return useQuery<ZabbixServerResDTO[], Error>({
    queryKey: [queryKeys.base, loginDetails?.id],
    queryFn: zabbixServerAPI.findByProjectAndUser,
  });
};



export const useCreateZabbixServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ZabbixServerReqDTO) => zabbixServerAPI.save(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.base] });
    },
  });
};


export const useUpdateZabbixServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ZabbixServerReqDTO }) =>
      zabbixServerAPI.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.base] });
    },
  });
};



export const useDeleteZabbixServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => zabbixServerAPI.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.base] });
    },
  });
};


