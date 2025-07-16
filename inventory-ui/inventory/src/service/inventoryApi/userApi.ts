import api from '../inventoryapi';
import type { UserReqDTO } from '../../types/requestDto';


export const usersAPI = {
    // GET: Fetch all users
    getAll: async () => {
        const response = await api.get('/api/v1/user');
        return response.data;
    },

    // POST: Create a single user
    create: async (userData: UserReqDTO) => {
        const response = await api.post('/api/v1/user', userData);
        return response.data;
    },

    // POST: Create multiple users in batch
    createBatch: async (usersData: UserReqDTO[]) => {
        const response = await api.post('/api/v1/user/batch', usersData);
        return response.data;
    },

    // GET: Fetch a user by ID
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/user/by-id`, { params: { id } });
        return response.data;
    },

    // GET: Fetch a user by username
    getByUsername: async (username: string) => {
        const response = await api.get(`/api/v1/user/by-username`, { params: { username } });
        return response.data;
    },

    // GET: Fetch a user by email
    getByEmail: async (email: string) => {
        const response = await api.get(`/api/v1/user/by-email`, { params: { email } });
        return response.data;
    },

    // GET: Fetch user role by ID
    getRoleByUserId: async (id: number) => {
        const response = await api.get(`/api/v1/user/get-role`, { params: { id } });
        return response.data;
    },

    // GET: Fetch all users sorted
    getSortedUsers: async () => {
        const response = await api.get(`/api/v1/user/sorted`);
        return response.data;
    },

    // GET: Fetch all users paginated
    getPagedUsers: async (page: number, size: number) => {
        const response = await api.get(`/api/v1/user/paged`, { params: { page, size } });
        return response.data;
    },

    // GET: Search users by full name
    searchUserByFullName: async (name: string) => {
        const response = await api.get(`/api/v1/user/search`, { params: { name } });
        return response.data;
    },

    // PUT: Update user details
    update: async (id: number, userData: UserReqDTO) => {
        const response = await api.put(`/api/v1/user/${id}`, userData);
        return response.data;
    },

    // PUT: Update user role
    updateRole: async (userId: number, roleId: number) => {
        const response = await api.put(`/api/v1/user/update-role`, { userId, roleId });
        return response.data;
    },

    // DELETE: Delete a single user by ID
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/user/${id}`);
        return response.data;
    },

    // DELETE: Delete multiple users by ID list
    deleteBatch: async (ids: number[]) => {
        const response = await api.delete(`/api/v1/user`, { data: { ids } });
        return response.data;
    }
};
