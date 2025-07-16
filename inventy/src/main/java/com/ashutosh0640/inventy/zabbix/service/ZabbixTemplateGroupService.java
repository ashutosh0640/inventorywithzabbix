package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixTemplateGroupService {

    private final ZabbixService zabbixService;

    public ZabbixTemplateGroupService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createTemplateGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.create", params, projectId);
    }

    public JsonNode deleteTemplateGroup(Long projectId, Object params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.delete", params, projectId);
    }

    public JsonNode getTemplateGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.get", params, projectId);
    }

    public JsonNode massAddTemplateGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.massadd", params, projectId);
    }

    public JsonNode massRemoveTemplateGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.massremove", params, projectId);
    }

    public JsonNode massUpdateTemplateGroups(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.massupdate", params, projectId);
    }

    public JsonNode propagateTemplateGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.propagate", params, projectId);
    }

    public JsonNode updateTemplateGroup(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("templategroup.update", params, projectId);
    }
}

