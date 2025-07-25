import { useQuery } from '@tanstack/react-query';
import { zabbixEventsAPI } from '../../service/zabbixApi/zabbixEventAPI';




export const useZabbixEventQuery = (projectId: number, params: object) => {
    return useQuery({
        queryKey: ['ZabbixEvents'],
        queryFn: () => zabbixEventsAPI.get(projectId, params),
        enabled: !!projectId
    })
}