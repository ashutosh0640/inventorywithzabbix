import { useQuery } from '@tanstack/react-query';
import { zabbixProblemsAPI } from '../../service/zabbixApi/zabbixProblemsAPI';
import { useProjectId } from './projectIdHook';
import type {
  ZabbixProblem,
  ZabbixProblemGetParams
} from '../../types/zabbixProblem';

const PROBLEMS = 'problems' as const;

/** e.g. queryKeys.list() ➜ ['problems','list'] */
const queryKeys = {
  base: [PROBLEMS] as const,
  list: () => [...queryKeys.base, 'list'] as const,
};

// Fetch Zabbix problems
export const useGetZabbixProblems = (params: ZabbixProblemGetParams) => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useQuery<ZabbixProblem[]>({
    queryKey: ['zabbixProblems', projectId, params],
    queryFn: () => zabbixProblemsAPI.get(projectId, params),
  });
};

// Fetch Zabbix problems count
export const useGetZabbixProblemsCount = (params: object) => {
  const projectId = useProjectId();
  if (!projectId) {
    throw new Error('Project ID is required to fetch host groups');
  }
  return useQuery({
    queryKey: ['zabbixProblemsCount', projectId, params],
    queryFn: () => zabbixProblemsAPI.getCount(projectId, params),
  });
};
