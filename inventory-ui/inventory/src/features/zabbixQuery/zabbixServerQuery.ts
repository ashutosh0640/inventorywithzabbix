import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixServerAPI } from '../../service/zabbixApi/zabbixServerAPI';
import type { ZabbixServerRequestDTO, ZabbixServerResponseDTO } from '../../types/zabbix';
import type { Login } from '../../types/responseDto';



export const useZabbixServers = () => {
  return useQuery<Set<ZabbixServerResponseDTO>, Error>({
    queryKey: ['ZabbixServers'],
    queryFn: zabbixServerAPI.getAll,
  });
};


export const useZabbixServerById = (id: number) => {
  return useQuery<ZabbixServerResponseDTO, Error>({
    queryKey: ['ZabbixServer', id],
    queryFn: () => zabbixServerAPI.getById(id),
    enabled: !!id,
  });
};

export const useZabbixServerByName = (name: string) => {
  return useQuery<ZabbixServerResponseDTO, Error>({
    queryKey: ['ZabbixServerByName', name],
    queryFn: () => zabbixServerAPI.getByName(name),
    enabled: !!name,
  });
};

export const useZabbixServerCount = () => {
  return useQuery<number>({
    queryKey: ['ZabbixServerCount'],
    queryFn: zabbixServerAPI.getCount
  })
};

export const useOnlineZabbixServerCount = () => {
  return useQuery<number>({
    queryKey: ['onlineZabbixServerCount'],
    queryFn: () => zabbixServerAPI.getOnlineCount(),
  });
};



export const useZabbixServerByProjectIdAndUser = (projectId: number) => {
  return useQuery<ZabbixServerResponseDTO, Error>({
    queryKey: ['ZabbixServerByProject', projectId],
    queryFn: () => zabbixServerAPI.findByProjectIdAndUserId(projectId),
    enabled: !!projectId,
  });
};


export const useZabbixServersByUser = () => {
    const user = sessionStorage.getItem('login');
    const loginData: Login = JSON.parse(user || '{}');
    const loginId = loginData?.id;
  return useQuery<ZabbixServerResponseDTO[], Error>({
    queryKey: ['ZabbixServersByUser', loginId],
    queryFn: zabbixServerAPI.findByUserId,
  });
};



export const useCreateZabbixServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ZabbixServerRequestDTO) => zabbixServerAPI.save(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixServers'] });
    },
  });
};


export const useUpdateZabbixServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ZabbixServerRequestDTO }) =>
      zabbixServerAPI.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixServers'] });
    },
  });
};



export const useDeleteZabbixServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => zabbixServerAPI.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ZabbixServers'] });
    },
  });
};


