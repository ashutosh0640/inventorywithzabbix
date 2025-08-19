import type {Project} from './responseDto'


export interface ZabbixServerReqDTO {
  name: string;
  url: string;
  username: string;
  password: string;
  token: string;
  projectId: number;
}

export interface ZabbixServerResDTO {
  id: number;
  name: string;
  url: string;
  username: string;
  status: string;
  project: Project;
}


export interface Host {
  id: string;
  name: string;
  status: 'enabled' | 'disabled' | 'monitored' | 'not_monitored';
  ip: string;
  groups: string[];
  templates: string[];
  problems: number;
  serverId: string;
}

export interface HostGroup {
  id: string;
  name: string;
  description?: string;
  hosts: number;
  subgroups?: string[];
  permissions?: string[];
  serverId: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  groups: string[];
  items: number;
  triggers: number;
  graphs?: number;
  discoveryRules?: number;
  webScenarios?: number;
  hosts?: string[];
  macros?: { name: string; value: string }[];
  serverId: string;
}

export interface TemplateGroup {
  id: string;
  name: string;
  description?: string;
  templates: number;
  subgroups?: string[];
  permissions?: string[];
  serverId: string;
}

export interface Event {
  id: string;
  timestamp: string;
  severity: 'not_classified' | 'information' | 'warning' | 'average' | 'high' | 'disaster';
  status: 'ok' | 'problem';
  name: string;
  host: string;
  acknowledged: boolean;
  serverId: string;
}

export interface Trigger {
  id: string;
  name: string;
  expression: string;
  priority: 'not_classified' | 'information' | 'warning' | 'average' | 'high' | 'disaster';
  status: 'enabled' | 'disabled';
  hosts: string[];
  serverId: string;
}

export interface Item {
  id: string;
  name: string;
  key: string;
  type: string;
  host: string;
  status: 'enabled' | 'disabled' | 'unsupported';
  lastValue: string;
  lastCheck: string;
  serverId: string;
}

export interface Problem {
  id: string;
  name: string;
  severity: 'not_classified' | 'information' | 'warning' | 'average' | 'high' | 'disaster';
  host: string;
  duration: string;
  acknowledged: boolean;
  serverId: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  status: 'enabled' | 'disabled';
  groups: string[];
  serverId: string;
}

export interface UserGroup {
  id: string;
  name: string;
  users: number;
  permissions: string[];
  serverId: string;
}

export type NavigationItem = 
  | 'dashboard'
  | 'projects'
  | 'servers'
  | 'hosts'
  | 'host-groups'
  | 'templates'
  | 'template-groups'
  | 'events'
  | 'triggers'
  | 'items'
  | 'problems'
  | 'users'
  | 'user-groups';