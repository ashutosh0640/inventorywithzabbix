package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixActionService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixActionService.class);

    public ZabbixActionService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createAction(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "name");
        return zabbixService.callZabbix("action.create", params, projectId);
    }

    public JsonNode deleteAction(Long projectId, Object actionIds) throws JsonProcessingException {
        return zabbixService.callZabbix("action.delete", actionIds, projectId);
    }

    public JsonNode getActions(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("action.get", params, projectId);
    }

    public JsonNode updateAction(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "actionid");
        return zabbixService.callZabbix("action.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null || params.get(key).toString().isBlank()) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }
}

