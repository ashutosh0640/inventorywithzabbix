import api from '../inventoryapi';
import type { LocationReqDTO } from '../../types/requestDto';


export const locationsAPI = {
    // POST: Create a single location
    create: async (dto: LocationReqDTO) => {
        const response = await api.post('/api/v1/location', dto);
        return response.data;
    },

    // POST: Create locations in batches
    createBatch: async (dto: LocationReqDTO[], batchSize: number) => {
        const response = await api.post('/api/v1/location/batch', { dto, batchSize });
        return response.data;
    },

    // GET: Fetch all locations
    getAll: async () => {
        const response = await api.get('/api/v1/location');
        return response.data;
    },

    // GET: Fetch a location by ID
    getById: async (id: number) => {
        const response = await api.get(`/api/v1/location/${id}`);
        return response.data;
    },

    // GET: Fetch sorted locations
    getSorted: async () => {
        const response = await api.get('/api/v1/location/sorted');
        return response.data;
    },

    // GET: Fetch paginated locations
    getPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get('/api/v1/location/paged', { params: { pageSize, pageNumber } });
        return response.data;
    },

    // GET: Search locations by name
    searchByName: async (name: string) => {
        const response = await api.get('/api/v1/location/search', { params: { name } });
        return response.data;
    },

    // GET: Get all locations for a specific user
    getLocationsForUser: async () => {
        const response = await api.get('/api/v1/location/users');
        return response.data;
    },

    // GET: Get locations for a user by ID
    getLocationForUser: async (id: number) => {
        const response = await api.get(`/api/v1/location/users/${id}`);
        return response.data;
    },

    // GET: Find locations for a project by user
    findLocationsByProject: async (id: number) => {
        const response = await api.get(`/api/v1/location/${id}/by-project`);
        return response.data;
    },

    // GET: Fetch paged locations for a user
    getLocationsforUserPaged: async (pageSize: number, pageNumber: number) => {
        const response = await api.get('/api/v1/location/users/paged', { params: { pageSize, pageNumber } });
        return response.data;
    },

    // GET: Search locations with pagination
    searchLocations: async (name: string, pageSize: number, pageNumber: number) => {
        const response = await api.get('/api/v1/location/search', { params: { name, pageSize, pageNumber } });
        return response.data;
    },

    // GET: Count locations for a user
    countByUser: async () => {
        const response = await api.get('/api/v1/location/count');
        return response.data;
    },
    // GET: Get counts of locations
    getCountLocationResource: async () => {
        const response = await api.get('/api/v1/location/counts');
        return response.data;
    },
    // GET: Check if a location is accessible by a user
    isLocationAccessible: async (id: number) => {
        const response = await api.get(`/api/v1/location/${id}/access`);
        return response.data;
    },

    // GET: Fetch location IDs for a user
    getLocationIdsForUser: async () => {
        const response = await api.get('/api/v1/location/users/ids');
        return response.data;
    },
    // PUT: Update a location
    update: async (id: number, dto: LocationReqDTO) => {
        const response = await api.put(`/api/v1/location/${id}`, dto);
        return response.data;
    },
    // PUT: Update a location for a user
    updateForUser: async (id: number, dto: LocationReqDTO) => {
        const response = await api.put(`/api/v1/location/${id}/update-location`, dto);
        return response.data;
    },

    // PUT: Add users to a location
    addUsersToLocation: async (id: number, userIds: Set<number>) => {
        const response = await api.put(`/api/v1/location/${id}/add-user`, { userIds });
        return response.data;
    },
    // DELETE: Delete a single location
    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/location/${id}`);
        return response.data;
    },
    // DELETE: Delete all locations assigned to a user
    deleteAllByUser: async () => {
        const response = await api.delete('/api/v1/location/users');
        return response.data;
    },
    // DELETE: Remove users from a location
    removeUsersFromLocation: async (id: number, userIds: Set<number>) => {
        const response = await api.delete(`/api/v1/location/${id}/remove-user`, { data: { userIds } });
        return response.data;
    },

    // DELETE: Delete a location assigned to a user by ID
    deleteForUser: async (id: number) => {
        const response = await api.delete(`/api/v1/location/${id}/users`);
        return response.data;
    }

};
