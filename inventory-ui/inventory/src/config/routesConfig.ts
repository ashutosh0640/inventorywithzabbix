// config/routes.ts
import type { PublicRoute, AppRoute, InventoryRoute, ZabbixRoute } from '../types/routes';

export const publicRoutes: Record<PublicRoute, { path: PublicRoute }> = {
  '/login': { path: '/login' },
  '/logout': { path: '/logout' }
};

export const inventoryRoutes: Record<InventoryRoute, { path: InventoryRoute }> = {
  '/inventory/locations': { path: '/inventory/locations' },
  '/inventory/locations/:id': { path: '/inventory/locations/:id' },
  '/inventory/location/:id/racks': { path: '/inventory/location/:id/racks' },
  '/inventory/racks': { path: '/inventory/racks' },
  '/inventory/racks/:id': { path: '/inventory/racks/:id' },
  '/inventory/racks/:id/baremetals': { path: '/inventory/racks/:id/baremetals' },
  '/inventory/racks/:id/networkDevice': { path: '/inventory/racks/:id/networkDevice' },
  '/inventory/baremetals': { path: '/inventory/baremetals' },
  '/inventory/baremetals/:id': { path: '/inventory/baremetals/:id' },
  '/inventory/baremetals/:id/virtualizations': { path: '/inventory/baremetals/:id/virtualizations' },
  '/inventory/virtualization': { path: '/inventory/virtualization' },
  '/inventory/virtualization/:id': { path: '/inventory/virtualization/:id' },
  '/inventory/virtualization/:id/virtualmachines': { path: '/inventory/virtualization/:id/virtualmachines' },
  '/inventory/virtualmachines': { path: '/inventory/virtualmachines' },
  '/inventory/virtualmachines/:id': { path: '/inventory/virtualmachines/:id' }
};

export const zabbixRoutes: Record<ZabbixRoute, { path: ZabbixRoute }> = {
  '/zabbix/problems': { path: '/zabbix/problems' },
  '/zabbix/hosts': { path: '/zabbix/hosts' },
  '/zabbix/hosts/:id': { path: '/zabbix/hosts/:id' },
  '/zabbix/hostgroup': { path: '/zabbix/hostgroup' },
  '/zabbix/hostgroup/:id': { path: '/zabbix/hostgroup/:id' },
  '/zabbix/templates': { path: '/zabbix/templates' },
  '/zabbix/templates/:id': { path: '/zabbix/templates/:id' },
  '/zabbix/templategroup': { path: '/zabbix/templategroup' },
  '/zabbix/templategroup/:id': { path: '/zabbix/templategroup/:id' },
  '/zabbix/management/users': { path: '/zabbix/management/users' },
  '/zabbix/management/users/:id': { path: '/zabbix/management/users/:id' },
  '/zabbix/management/usergroup': { path: '/zabbix/management/usergroup' },
  '/zabbix/management/usergroup/:id': { path: '/zabbix/management/usergroup/:id' },
  '/zabbix/management/userrole': { path: '/zabbix/management/userrole' },
  '/zabbix/management/auth': { path: '/zabbix/management/auth' },
  '/zabbix/management/token': { path: '/zabbix/management/token' }
};

export const appRoutes: Record<AppRoute, { path: AppRoute }> = {
  '/messages': { path: '/messages' },
  '/dashboard': { path: '/dashboard' },
  '/project': { path: '/project' },
  ...inventoryRoutes,
  '/zabbix': { path: '/zabbix' },
  ...zabbixRoutes,
  '/settings': { path: '/settings' },
  '/administrator': { path: '/administrator' }
};

export const routes = {
  ...publicRoutes,
  ...appRoutes
};