import { useQuery } from '@tanstack/react-query';
import { zabbixProblemsAPI } from '../../service/zabbixApi/zabbixProblemsAPI';

// Fetch Zabbix problems
export const useGetZabbixProblems = (projectId: number, data: object) => {
  return useQuery({
    queryKey: ['zabbixProblems', projectId, data],
    queryFn: () => zabbixProblemsAPI.get(projectId, data),
  });
};

// Fetch Zabbix problems count
export const useGetZabbixProblemsCount = (projectId: number, data: object) => {
  return useQuery({
    queryKey: ['zabbixProblemsCount', projectId, data],
    queryFn: () => zabbixProblemsAPI.getCount(projectId, data),
  });
};
