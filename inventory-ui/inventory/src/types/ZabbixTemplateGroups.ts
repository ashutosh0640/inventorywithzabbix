/**
 * Generic Zabbix API request structure.
 * T is the type of the params object.
 */
export interface ZabbixApiRequest<T> {
    jsonrpc: '2.0';
    method: string;
    params: T;
    auth?: string; // Authentication token
    id: number;
}
//========================================================//
/**
 * Host Group Object
 */
/** Reference to a Host (when using selectHosts) */
export interface ZabbixTemplateRef {
  templateid: string;
  host?: string;   // technical template name
  name?: string;   // visible template name
}

/** Template Group object from Zabbix API */
export interface ZabbixTemplateGroup {
  groupid: string;  // unique ID
  name: string;     // group name

  /** "0" = plain, "4" = discovered */
  flags?: string;

  /** "1" = internal (system) group, "0" = normal */
  internal?: string;

  /** UUID (Zabbix 6.0+) */
  uuid?: string;

  /** Array of templates if requested with selectTemplates */
  templates?: ZabbixTemplateRef[];
}

//========================================================//

/**
 * 'templategroup.get' Zabbix API method parameters.
 */
export interface TemplateGroupGetParams {
  groupids?: string[]; // Filter by template group IDs
  output?: "extend" | Array<keyof ZabbixTemplateGroup>; // Fields to return
  filter?: Partial<Pick<ZabbixTemplateGroup, "name">>; // Exact match filtering
  search?: Partial<Pick<ZabbixTemplateGroup, "name">>; // Partial match search
  searchByAny?: boolean; // Match any search field
  startSearch?: boolean; // Match from beginning of string
  sortfield?: Array<"name" | "groupid"> | "name" | "groupid"; // Sorting field
  sortorder?: "ASC" | "DESC"; // Sorting direction
  selectTemplates?: "count" | "extend" | Array<keyof ZabbixTemplateRef>; // Include templates
  limit?: number; // Max number of results
}
//========================================================//
/**
 * 'templategroup.create' Zabbix API method parameters.
 */
export interface TemplateGroupCreateParams {
    name: string;  // name of the new template group
}
//========================================================//
/**
 * 'templategroup.delete' Zabbix API method parameters.
 * Pass an array of groupids to delete.
 */
export type TemplateGroupDeleteParams = string[];
//========================================================//
/** 'templategroup.update' Zabbix API method parameters.
 */
export interface TemplateGroupUpdateParams {
    groupid: string; // ID of the group to update
    name?: string;   // new name (optional)
}
//========================================================//
/** 
 * 'templategroup.massadd' Zabbix API method parameters.
 * Used to bulk add templates to groups.
 */
export interface TemplateGroupMassAddParams {
    groups: { groupid: string }[];       // array of group IDs
    templates: { templateid: string }[]; // array of template IDs
}
//========================================================//
/** 
 * 'templategroup.massremove' Zabbix API method parameters.
 */
export interface TemplateGroupMassRemoveParams {
    groupids: string[];       // array of group IDs
    templateids: string[];    // array of template IDs
}
//========================================================//
