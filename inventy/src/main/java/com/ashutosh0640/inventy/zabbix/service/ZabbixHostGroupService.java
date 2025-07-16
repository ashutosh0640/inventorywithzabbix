package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixHostGroupService {

    private final ZabbixService zabbixService;

    public ZabbixHostGroupService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createHostGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "name");
        return zabbixService.callZabbix("hostgroup.create", params, projectId);
    }

    public JsonNode deleteHostGroup(Long projectId, Object params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.delete", params, projectId);
    }

    public JsonNode getHostGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.get", params, projectId);
    }

    public JsonNode massAddHostGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.massadd", params, projectId);
    }

    public JsonNode massRemoveHostGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.massremove", params, projectId);
    }

    public JsonNode massUpdateHostGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.massupdate", params, projectId);
    }

    public JsonNode propagateHostGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostgroup.propagate", params, projectId);
    }

    public JsonNode updateHostGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "groupid");
        return zabbixService.callZabbix("hostgroup.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }
}

