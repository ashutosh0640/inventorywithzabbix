package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixHostInterfaceService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixHostInterfaceService.class);

    public ZabbixHostInterfaceService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createInterface(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "hostid");
        validateRequiredParam(params, "ip");
        return zabbixService.callZabbix("hostinterface.create", params, projectId);
    }

    public JsonNode deleteInterface(Long projectId, Object interfaceIds) throws JsonProcessingException {
        return zabbixService.callZabbix("hostinterface.delete", interfaceIds, projectId);
    }

    public JsonNode getInterfaces(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostinterface.get", params, projectId);
    }

    public JsonNode massAddInterfaces(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostinterface.massadd", params, projectId);
    }

    public JsonNode massRemoveInterfaces(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostinterface.massremove", params, projectId);
    }

    public JsonNode replaceHostInterfaces(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("hostinterface.replacehostinterfaces", params, projectId);
    }

    public JsonNode updateInterface(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        validateRequiredParam(params, "interfaceid");
        return zabbixService.callZabbix("hostinterface.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null || params.get(key).toString().isBlank()) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }
}

