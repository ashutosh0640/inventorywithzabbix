import api from '../inventoryapi';
import type { ProjectReqDTO } from '../../types/requestDto';

export const projectsAPI = {
    // POST: Create a single project
    create: async (dto: ProjectReqDTO) => {
        const response = await api.post('/api/v1/project', dto);
        return response.data;
    },

    // POST: Create projects in batches
    createBatch: async (list: ProjectReqDTO[], batchSize: number) => {
        const response = await api.post('/api/v1/project/batch', { list, batchSize });
        return response.data;
    },

    // GET: Fetch all projects
    getAll: async () => {
        const response = await api.get('/api/v1/project');
        return response.data;
    },

    // GET: Fetch a project by ID
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/project/${id}`);
        return response.data;
    },

    // GET: Fetch sorted projects
    getSorted: async () => {
        const response = await api.get('/api/v1/project/sorted');
        return response.data;
    },

    // GET: Fetch paginated projects
    getPaged: async (page: number, size: number) => {
        const response = await api.get('/api/v1/project/paged', { params: { page, size } });
        return response.data;
    },

    // GET: Search projects by name
    search: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get('/api/v1/project/search', { params: { name, pageSize, pageNumber } });
        return response.data;
    },

    // GET: Count projects for a user
    countByUser: async () => {
        const response = await api.get('/api/v1/project/count');
        return response.data;
    },

    // GET: Check if project is accessible by a user
    isAccessible: async (id: number) => {
        const response = await api.get(`/api/v1/project/isAccessible/${id}`);
        return response.data;
    },

    // GET: Get project IDs associated with a user
    getProjectIdsByUser: async () => {
        const response = await api.get('/api/v1/project/get-project-ids');
        return response.data;
    },

    // PUT: Update project details
    update: async (id: number, dto: ProjectReqDTO) => {
        const response = await api.put(`/api/v1/project/${id}`, dto);
        return response.data;
    },

    // PATCH: Add locations to a project
    addLocations: async (id: number, locationIds: Set<number>) => {
        const response = await api.patch(`/api/v1/project/add-location/${id}`, { locationIds });
        return response.data;
    },

    // PATCH: Add users to a project
    addUsers: async (id: number, userIds: Set<number>) => {
        const response = await api.patch(`/api/v1/project/add-user/${id}`, { userIds });
        return response.data;
    },

    // PATCH: Remove locations from a project
    removeLocations: async (id: number, locationIds: Set<number>) => {
        const response = await api.patch(`/api/v1/project/remove-location/${id}`, { locationIds });
        return response.data;
    },

    // PATCH: Remove users from a project
    removeUsers: async (id: number, userIds: Set<number>) => {
        const response = await api.patch(`/api/v1/project/remove-user/${id}`, { userIds });
        return response.data;
    },

    // DELETE: Delete a single project
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/project/${id}`);
        return response.data;
    },

    // DELETE: Delete multiple projects
    deleteBatch: async (ids: number[]) => {
        const response = await api.delete('/api/v1/project', { data: { ids } });
        return response.data;
    }
};
