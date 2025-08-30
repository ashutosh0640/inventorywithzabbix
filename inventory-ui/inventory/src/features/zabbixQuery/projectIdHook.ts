// hooks/useProjectId.ts
import { useAppSelector } from "../../slice/hooks"; // adjust path

export const useProjectId = () => {
  const selectedServer = useAppSelector(state => state.zabbixserver.selectedServer);
  const projectId = selectedServer?.project.id || null;

  return projectId;
};
