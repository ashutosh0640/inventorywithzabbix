import {useQuery} from '@tanstack/react-query';
import {zabbixActionsAPI} from '../../service/zabbixApi/zabbixActionAPI';


// Get Alerts
export const useZabbixAlerts = (projectId: number, params: object) => {
    return useQuery({
        queryKey: ['zabbixAlerts'],
        queryFn: () => zabbixActionsAPI.get(projectId, params),
    });
}