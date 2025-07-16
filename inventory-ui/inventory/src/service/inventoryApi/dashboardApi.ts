import api from '../inventoryapi';
import type { Dashboard } from '../../types/responseDto';


export const dashboardAPI = {
    getDashboardData: async () : Promise<Dashboard> => {
        const response = await api.get('/api/v1/dashboard/details');
        return response.data;
    }
}