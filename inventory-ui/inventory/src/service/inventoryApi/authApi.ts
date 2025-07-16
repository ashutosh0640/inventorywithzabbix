import api from '../inventoryapi';
import type { LoginReqDTO } from '../../types/requestDto';



// Auth API
export const authAPI = {
    login: async (loginReq: LoginReqDTO) => {
        console.log('Logging in with authAPI:', loginReq.username, loginReq.password);
        const response = await api.post('/auth/login',
            {
                username: loginReq.username,
                password: loginReq.password
            }
        );
        return response.data;
    },

    verifyToken: async (token: string): Promise<boolean> => {
        console.log('Verifying token with @RequestParam GET:', token);
        const response = await api.get('/auth/verify', {
            params: {
                token: token
            }
        });
        return response.data;
    },
};