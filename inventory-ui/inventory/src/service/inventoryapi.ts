import axios from 'axios';

const baseURL = 'http://localhost:8080';
const SESSION_KEY = 'loginDetails';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Handle response errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const stored = sessionStorage.getItem(SESSION_KEY) || '{}';
    const loginData = JSON.parse(stored);
    const token = loginData.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


export { baremetalsAPI } from './inventoryApi/bareMetalApi';
export { usersAPI } from './inventoryApi/userApi';
export { racksAPI } from './inventoryApi/rackApi';
export { virtualPlatformsAPI } from './inventoryApi/virtualPlatformApi';
export { authAPI } from './inventoryApi/authApi';
export { locationsAPI } from './inventoryApi/locationApi';
export { rolesAPI } from './inventoryApi/roleApi';
export { projectsAPI } from './inventoryApi/projectApi';
export { virtualMachineAPI } from './inventoryApi/virtualMachineApi';
export { permissionAPI } from './inventoryApi/permissionApi';

export { zabbixAlertsAPI } from './zabbixApi/zabbixAlertAPI';
export { zabbixDashboardAPI } from './zabbixApi/zabbixDashbaordAPI';
export { zabbixEventsAPI } from './zabbixApi/zabbixEventAPI';
export { zabbixHostsAPI } from './zabbixApi/zabbixHostAPI';
export { zabbixHostGroupsAPI } from './zabbixApi/zabbixHostGroupAPI';
export { zabbixItemsAPI } from './zabbixApi/zabbixItemsAPI';
export { zabbixProblemsAPI } from './zabbixApi/zabbixProblemsAPI';
export { zabbixServerAPI } from './zabbixApi/zabbixServerAPI';
export { zabbixTemplatesAPI } from './zabbixApi/zabbixTemplateAPI';
export { zabbixTemplateGroupsAPI } from './zabbixApi/zabbixTemplateGroupsAPI';
export { zabbixTriggersAPI } from './zabbixApi/zabbixTriggerAPI';
export { zabbixUsersAPI } from './zabbixApi/zabbixUserAPI';