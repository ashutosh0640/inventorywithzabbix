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
export interface ZabbixTemplateGroup {
    groupid: string;   // unique group ID
    name: string;      // group name
    flags: string;     // internal flags (0=manual, 4=discovered, etc.)
    uuid?: string;     // optional UUID
}
//========================================================//

/**
 * 'templategroup.get' Zabbix API method parameters.
 */
export interface TemplateGroupGetParams {
    output?: 'extend' | string[];        // "extend" or specific fields
    groupids?: string[];                 // filter by groupids
    selectTemplates?: 'extend' | string[]; // fetch related templates
    filter?: Record<string, string | string[]>; // flexible filter
    limit?: number;                      // limit results
    sortfield?: string | string[];       // sort by field(s)
    sortorder?: 'ASC' | 'DESC';          // sort order
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
