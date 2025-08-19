// hooks/useNetworkDevices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { networkDeviceAPI } from '../../service/inventoryApi/networkDeviceAPI';
import type { NetworkDeviceReqDTO } from '../../types/requestDto';
import { useAppSelector } from '../../slice/hooks';
import type { NetworkDevices } from '../../types/responseDto';

// 🔍 Fetch All Devices
export const useNetworkDevices = () =>
  useQuery({
    queryKey: ['network-devices'],
    queryFn: networkDeviceAPI.getAll,
  });

// 🔍 Fetch By ID
export const useNetworkDeviceById = (id: number) =>
  useQuery({
    queryKey: ['network-device', id],
    queryFn: () => networkDeviceAPI.getById(id),
    enabled: !!id,
  });

// 🔍 By IP
export const useNetworkDeviceByIp = (ip: string) =>
  useQuery({
    queryKey: ['network-device-ip', ip],
    queryFn: () => networkDeviceAPI.getByIp(ip),
    enabled: !!ip,
  });

// 🔍 Sorted
export const useSortedNetworkDevices = () =>
  useQuery({
    queryKey: ['network-devices-sorted'],
    queryFn: networkDeviceAPI.getAllSorted,
  });

// 🔍 Paginated
export const usePaginatedNetworkDevices = (page = 0, size = 5) =>
  useQuery({
    queryKey: ['network-devices-paged', page, size],
    queryFn: () => networkDeviceAPI.getAllPaginated(page, size),
  });

// ✅ Create
export const useCreateNetworkDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: networkDeviceAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
    },
  });
};

// ✅ Create Batch
export const useCreateNetworkDeviceBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: networkDeviceAPI.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
    },
  });
};

// 🔄 Update
export const useUpdateNetworkDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NetworkDeviceReqDTO }) =>
      networkDeviceAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
    },
  });
};

// 🧯 Delete
export const useDeleteNetworkDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => networkDeviceAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
    },
  });
};

// 🔍 Search by Name
export const useSearchNetworkDeviceByName = (name: string, page = 0, size = 5) =>
  useQuery({
    queryKey: ['search-network-device-name', name, page, size],
    queryFn: () => networkDeviceAPI.searchByNamePaged(name, page, size),
    enabled: !!name,
  });

// 🔄 Add Users
export const useAddUsersToNetworkDevice = () => {
  return useMutation({
    mutationFn: ({ id, userIds }: { id: number; userIds: number[] }) =>
      networkDeviceAPI.addUsers(id, userIds),
  });
};

// ❌ Remove Users
export const useRemoveUsersFromNetworkDevice = () => {
  return useMutation({
    mutationFn: ({ id, userIds }: { id: number; userIds: number[] }) =>
      networkDeviceAPI.removeUsers(id, userIds),
  });
};

// 🔍 Search By Serial Number
export const useSearchBySno = (sNo: string) =>
  useQuery({
    queryKey: ['network-device-sno', sNo],
    queryFn: () => networkDeviceAPI.searchBySno(sNo),
    enabled: !!sNo,
  });

// All By Users
  export const useNetworkDevicesByUser = () => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<NetworkDevices[], Error>({
      queryKey: ['network-devices', "by-user", loginDetails?.id],
      queryFn: async () => {
        const response = await networkDeviceAPI.getAllByUsers();
        return response;
      }
    });
  }

  // 🧾 Count By Users
  export const useCountNetworkDevicesByUser = () =>
    useQuery({
      queryKey: ['network-devices-count'],
      queryFn: networkDeviceAPI.countByUsers,
    });

  // 🔍 Get Devices by User IDs
  export const useDevicesForUserByIds = (ids: number[]) =>
    useQuery({
      queryKey: ['network-devices-by-user-ids', ids],
      queryFn: () => networkDeviceAPI.getDevicesForUserByIds(ids),
      enabled: ids.length > 0,
    });

  // 🔍 Get Devices by rack and  User
  export const useDeviceByRackAndUser = (rackId: number | null) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    return useQuery<NetworkDevices[], Error>({
      queryKey: ['NetworkDevices', 'byrack', rackId, loginDetails?.id],
      queryFn: async () => {
        const response = await networkDeviceAPI.getByRackAndUser(rackId!);
        return response;
      },
      enabled: !!rackId
    });
  }

  // 📥 Accessible Check
  export const useIsDeviceAccessible = (id: number) =>
    useQuery({
      queryKey: ['network-device-access', id],
      queryFn: () => networkDeviceAPI.isAccessibleByUser(id),
      enabled: !!id,
    });

  // 🔄 Update by Users
  export const useUpdateDeviceByUsers = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: NetworkDeviceReqDTO }) =>
        networkDeviceAPI.updateByUsers(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['network-devices'] });
      },
    });
  };
