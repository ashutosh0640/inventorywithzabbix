export type PublicRoute = '/login' | '/logout';

export type InventoryRoute = 
  '/inventory/locations' |
  `/inventory/locations/${string}` |
  `/inventory/location/${string}/racks` |
  '/inventory/racks' |
  `/inventory/racks/${string}` |
  `/inventory/racks/${string}/baremetals` |
  '/inventory/baremetals' |
  `/inventory/baremetals/${string}` |
  `/inventory/baremetals/${string}/virtualizations` |
  '/inventory/virtualization' |
  `/inventory/virtualization/${string}` |
  `/inventory/virtualization/${string}/virtualmachines` |
  '/inventory/virtualmachines' |
  `/inventory/virtualmachines/${string}`;

export type ZabbixRoute =
  '/zabbix/problems' |
  '/zabbix/hosts' |
  `/zabbix/hosts/${string}` |
  '/zabbix/hostgroup' |
  `/zabbix/hostgroup/${string}` |
  '/zabbix/templates' |
  `/zabbix/templates/${string}` |
  '/zabbix/templategroup' |
  `/zabbix/templategroup/${string}`|
  '/zabbix/management/users' |
  `/zabbix/management/users/${string}` |
  '/zabbix/management/usergroup' |
  `/zabbix/management/usergroup/${string}` |
  '/zabbix/management/userrole' |
  '/zabbix/management/auth' |
  '/zabbix/management/token';

export type AppRoute = 
  '/messages' |
  '/dashboard' |
  '/project' |
  InventoryRoute |
  '/zabbix' | ZabbixRoute |
  '/settings' |
  '/administrator';

export type Route = PublicRoute | AppRoute;