import { useQuery, useMutation } from '@tanstack/react-query';
import { zabbixUsersAPI } from '../../service/zabbixApi/zabbixUserAPI';

// Check authentication
export const useCheckZabbixUserAuth = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.checkAuthentication(projectId, data),
  });
};

// Create user
export const useCreateZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.create(projectId, data),
  });
};

// Delete user
export const useDeleteZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.delete(projectId, data),
  });
};

// Get users
export const useGetZabbixUsers = (projectId: number, data: object) => {
  return useQuery({
    queryKey: ['zabbixUsers', projectId, data],
    queryFn: () => zabbixUsersAPI.get(projectId, data),
  });
};

// Get users count
export const useGetZabbixUserCount = (projectId: number, data: object) => {
  return useQuery({
    queryKey: ['zabbixUserCount', projectId, data],
    queryFn: () => zabbixUsersAPI.getCount(projectId, data),
  });
};

// Login user
export const useLoginZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.login(projectId, data),
  });
};

// Logout user
export const useLogoutZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.logout(projectId, data),
  });
};

// Provision user
export const useProvisionZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.provision(projectId, data),
  });
};

// Reset TOTP
export const useResetZabbixUserTotp = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.resetTotp(projectId, data),
  });
};

// Unblock user
export const useUnblockZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.unblock(projectId, data),
  });
};

// Update user
export const useUpdateZabbixUser = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: object }) =>
      zabbixUsersAPI.update(projectId, data),
  });
};
