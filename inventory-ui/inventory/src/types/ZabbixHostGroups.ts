//========================================================//
/**
 * Defines the structure of a generic Zabbix JSON-RPC request.
 * The `params` are typed using our specific interface.
 */
export interface ZabbixApiRequest<T> {
  jsonrpc: '2.0';
  method: string;
  params: T;
  auth?: string; // Authentication token
  id: number;
}
//========================================================//
//============= Host Group Related Types =================//
//========================================================//
/**
 * Host Group Object
 */
/** Reference to a Host (when using selectHosts) */
export interface ZabbixHostRef {
  hostid: string;
  host?: string;   // technical host name
  name?: string;   // visible host name
}

/** Reference to a Template (when using selectTemplates) */
export interface ZabbixTemplateRef {
  templateid: string;
  host?: string;   // technical template name
  name?: string;   // visible template name
}

/** Host Group object from Zabbix API */
export interface ZabbixHostGroup {
  groupid: string;  // unique ID
  name: string;     // group name

  /** "0" = plain, "4" = discovered */
  flags?: string;

  /** "1" = internal (system) group, "0" = normal */
  internal?: string;

  /** UUID (Zabbix 6.0+) */
  uuid?: string;

  /** Array of hosts if requested with selectHosts */
  hosts?: ZabbixHostRef[];

  /** Array of templates if requested with selectTemplates */
  templates?: ZabbixTemplateRef[];
}
//========================================================//

/**
 * 'hostgroup.create' Zabbix API method.
 */
export interface ZabbixHostgroupCreateParams {
  name: string;
}
//========================================================//
/**
 * 'hostgroup.delete' Zabbix API method.
 */
export type ZabbixHostgroupDeleteParams = string[];
//========================================================//
/**
 * 'hostgroup.get' Zabbix API method.
 * Allows filtering host groups by various criteria.
 */
export interface ZabbixHostgroupFilter {
  name?: string | string[];
  groupid?: string | string[];
  // You can add other filter properties like 'hosts' or 'graphs' as needed
  [key: string]: any;
}
//========================================================//
/**
 * Represents a reference to a Zabbix host group, typically by its ID.
 */
interface ZabbixGroupReference {
  groupid: string;
}

/**
 * Represents a reference to a Zabbix host, typically by its ID.
 */
interface ZabbixHostReference {
  hostid: string;
}

/**
 * 'hostgroup.massadd' Zabbix API method.
 * This is used to add multiple hosts to multiple host groups.
 */
export interface ZabbixHostgroupMassaddParams {
  /** The host groups to add the hosts to. */
  groups: ZabbixGroupReference[];

  /** The hosts to be added to the host groups. */
  hosts: ZabbixHostReference[];
}
//========================================================//
/**
 * 'hostgroup.massremove' Zabbix API method.
 * This is used to remove multiple hosts to multiple host groups.
 */
export interface ZabbixHostgroupmassremoveParams {
  /** The host groups to add the hosts to. */
  groupids: string[];

  /** The hosts to be added to the host groups. */
  hostids: string[];
}
//========================================================//
/**
 * 'hostgroup.get' Zabbix API method.
 */
export interface ZabbixHostgroupGetParams {
  groupids?: string[];                     // filter by IDs
  output?: "extend" | Array<keyof ZabbixHostGroup>; // which fields to return
  filter?: Partial<Pick<ZabbixHostGroup, "name">>;
  search?: Partial<Pick<ZabbixHostGroup, "name">>;
  searchByAny?: boolean;
  startSearch?: boolean;
  sortfield?: Array<"name" | "groupid"> | "name" | "groupid";
  sortorder?: "ASC" | "DESC";
  selectHosts?: "count" | "extend" | Array<keyof ZabbixHostRef>;
  selectTemplates?: "count" | "extend";
  limit?: number;
}
//========================================================//
/**
 * 'hostgroup.massupdate' Zabbix API method.
 */
export interface HostGroupMassUpdateParams {
  groups: { groupid: string }[];
  hosts: { hostid: string }[];
}
//========================================================//
/**
 * 'hostgroup.update' Zabbix API method.
 */
export interface HostGroupUpdateParams {
  groupid: string;
  name: string;
}
//========================================================//