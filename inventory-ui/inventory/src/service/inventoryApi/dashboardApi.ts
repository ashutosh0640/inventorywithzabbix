import api from '../inventoryapi';
import type { Dashboard } from '../../types/responseDto';

  interface InventoryDataprops {
    location: string;
    rackCount: number;
    baremetalCount: number;
    networkDeviceCount: number;
    slotsCount: number;
    rackOccupiedPer: number;
  }


export const dashboardAPI = {
    getDashboardData: async () : Promise<Dashboard> => {
        const response = await api.get('/api/v1/dashboard/details');
        return response.data;
    },
    getLocationsDetails: async () : Promise<InventoryDataprops[]> => {
        const response = await api.get('/api/v1/dashboard/location/details');
        return response.data;
    }
}