export interface ZabbixTag {
  tag: string;
  value: string;
}

export interface ZabbixAcknowledgement {
  acknowledgeid: string;
  userid: string;
  eventid: string;
  clock: string;
  message: string;
  action: string;
}

export interface ZabbixTriggerRef {
  triggerid: string;
  description: string;
  expression?: string;
  priority?: string;
}

export interface ZabbixHostRef {
  hostid: string;
  name: string;
}

export interface ZabbixHostGroup {
  groupid: string;
  name: string;
}



/** Problem object from Zabbix API */
export interface ZabbixProblem {
  eventid: string;           // Unique ID of the problem event
  source: string;            // Source of the event (e.g. 0 = trigger)
  object: string;            // Object type (e.g. 0 = trigger)
  objectid: string;          // ID of the object that caused the problem
  clock: string;             // Timestamp of the problem (Unix time)
  ns: string;                // Nanoseconds part of the timestamp
  r_eventid?: string;        // Recovery event ID (if resolved)
  acknowledged: string;      // "1" if acknowledged, "0" otherwise
  severity: string;          // Severity level (0–5)
  value: string;             // "1" = problem, "0" = OK
  correlationid?: string;    // ID of the correlation rule (if any)
  userid?: string;           // ID of the user who acknowledged
  name?: string;             // Problem name (if requested via selectTags or selectAcknowledges)
  tags?: ZabbixTag[];        // Tags associated with the problem
  acknowledges?: ZabbixAcknowledgement[]; // Acknowledgement history
  hosts?: ZabbixHostRef[];   // Hosts involved (if selectHosts is used)
  groups?: ZabbixHostGroup[]; // Host groups (if selectGroups is used)
  triggers?: ZabbixTriggerRef[]; // Trigger info (if selectTriggers is used)
}


//========================================================================//
export interface ZabbixProblemGetParams {
  /** Filter by specific event IDs */
  eventids?: string[];

  /** Filter by object IDs (e.g., trigger IDs) */
  objectids?: string[];

  /** Filter by source type (e.g., 0 = trigger) */
  source?: number;

  /** Filter by object type (e.g., 0 = trigger) */
  object?: number;

  /** Filter by severity level (0–5) */
  severity?: number | number[];

  /** Filter by problem value (1 = problem, 0 = OK) */
  value?: number;

  /** Filter by acknowledged status (1 = acknowledged, 0 = not) */
  acknowledged?: boolean;

  /** Filter by recovery event ID */
  r_eventid?: string;

  /** Filter by correlation ID */
  correlationid?: string;

  /** Filter by user ID (who acknowledged) */
  userid?: string;

  /** Filter by time range (Unix timestamp) */
  time_from?: number;
  time_till?: number;

  /** Filter by tags */
  tags?: Array<{ tag: string; value?: string }>;

  /** Whether to match any tag (true) or all (false) */
  tag_search?: boolean;

  /** Whether to include acknowledged problems only */
  recent?: boolean;

  /** Whether to include suppressed problems */
  suppressed?: boolean;

  /** Whether to include manually closed problems */
  manually_closed?: boolean;

  /** Whether to include problems with no recovery event */
  withSuppressed?: boolean;

  /** Whether to include problems with no acknowledged status */
  withAcknowledged?: boolean;

  /** Whether to include problems with no tags */
  withTags?: boolean;

  /** Whether to include problems with no correlation */
  withCorrelation?: boolean;

  /** Limit number of results */
  limit?: number;

  /** Sort field(s): e.g., "eventid", "clock" */
  sortfield?: string | string[];

  /** Sort order: "ASC" or "DESC" */
  sortorder?: "ASC" | "DESC";

  /** Output format: "extend" or array of field names */
  output?: "extend" | Array<keyof ZabbixProblem>;

  /** Select related hosts */
  selectHosts?: "extend" | "count" | Array<keyof ZabbixHostRef>;

  /** Select related groups */
  selectGroups?: "extend" | "count" | Array<keyof ZabbixHostGroup>;

  /** Select related tags */
  selectTags?: "extend" | "count";

  /** Select related acknowledgements */
  selectAcknowledges?: "extend" | "count";

  /** Select related triggers */
  selectTriggers?: "extend" | "count" | Array<keyof ZabbixTriggerRef>;
}
