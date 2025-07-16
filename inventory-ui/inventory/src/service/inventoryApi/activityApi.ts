import api from '../inventoryapi';
import type { RecentActivity } from '../../types/responseDto';


export const activityAPI = {
    getActivity: async (): Promise<RecentActivity> => {
        const response = await api.get(`/api/v1/activity`);
        return response.data;
    },
    getActivitiesByPage: async (page: number, size: number): Promise<RecentActivity[]> => {
        const response = await api.get(`/api/v1/activity/page?page=${page}&size=${size}`);
        return response.data;
    },
    getRecentActivitiesByPage: async (page: number, size: number): Promise<RecentActivity[]> => {
        const response = await api.get(`/api/v1/activity/recent?page=${page}&size=${size}`);
        return response.data;
    }

};