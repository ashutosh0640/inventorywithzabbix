package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixTriggerService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixTriggerService.class);

    public ZabbixTriggerService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createTrigger(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "description");
        validateRequiredParam(params, "expression");
        return zabbixService.callZabbix("trigger.create", params, projectId);
    }

    public JsonNode deleteTrigger(Long projectId, Object triggerIds) throws JsonProcessingException {
        return zabbixService.callZabbix("trigger.delete", triggerIds, projectId);
    }

    public JsonNode getTriggers(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("trigger.get", params, projectId);
    }

    public Integer getTriggersCount(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Counting triggers number.");
        return zabbixService.callZabbix("trigger.get", params, projectId).get("result").size();

    }

    public JsonNode updateTrigger(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "triggerid");
        return zabbixService.callZabbix("trigger.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null || params.get(key).toString().trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }
}

