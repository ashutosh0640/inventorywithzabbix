import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '../../service/inventoryApi/authApi';
import type { LoginReqDTO } from '../../types/requestDto';

// Login hook
export const useLogin = () => {
  return useMutation({
    mutationFn: (loginReq: LoginReqDTO) => authAPI.login(loginReq),
  });
};

// Token verification hook
export const useVerifyToken = (token: string) => {
  return useQuery({
    queryKey: ['verifyToken', token],
    queryFn: () => authAPI.verifyToken(token),
    enabled: !!token,
  });
};
