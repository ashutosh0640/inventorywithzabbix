package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZabbixItemService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixItemService.class);

    public ZabbixItemService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createItem(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "name");
        validateRequiredParam(params, "key_");
        return zabbixService.callZabbix("item.create", params, projectId);
    }

    public JsonNode deleteItem(Long projectId, Object itemIds) throws JsonProcessingException {
        return zabbixService.callZabbix("item.delete", itemIds, projectId);
    }

    public JsonNode getItems(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("item.get", params, projectId);
    }

    public Integer getItemsCount(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Counting items number.");
        return zabbixService.callZabbix("problem.get", params, projectId).get("result").size();
    }

    public JsonNode updateItem(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "itemid");
        return zabbixService.callZabbix("item.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }
}

