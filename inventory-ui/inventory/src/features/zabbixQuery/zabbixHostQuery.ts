import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zabbixHostsAPI } from '../../service/zabbixApi/zabbixHostAPI';


export const useCreateZabbixHost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: number, data: object}) => 
             zabbixHostsAPI.create(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ZabbixHosts'] });
        }
    })
}


export const useDeleteZabbixHost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, hostIds }: { projectId: number, hostIds: [number] }) => 
            zabbixHostsAPI.delete(projectId, hostIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ZabbixHosts'] });
        }
    })
}


export const useZabbixHosts = (projectId: number, params: object) => {
    return useQuery({
        queryKey: ['ZabbixHosts', projectId, params],
        queryFn: () => zabbixHostsAPI.get(projectId, params),
        enabled: !!projectId
    })
}


export const useAddmassZabbixHosts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, params }: { projectId: number, params: object}) => 
            zabbixHostsAPI.massAdd(projectId, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ZabbixHosts'] });
        }
    })
}

export const useRemovemassZabbixHosts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, params }: { projectId: number, params: object}) =>
            zabbixHostsAPI.massRemove(projectId, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ZabbixHosts'] });
        }
    })
}