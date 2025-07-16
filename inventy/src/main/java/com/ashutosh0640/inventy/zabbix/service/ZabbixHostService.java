package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ZabbixHostService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixHostService.class);

    public ZabbixHostService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode createHost(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Creating zabbix host.");
        validateRequiredParam(params, "host");
        return zabbixService.callZabbix("host.create", params, projectId);
    }

    public JsonNode deleteHost(Long projectId, Object hostIds) throws JsonProcessingException {
        LOGGER.info("Deleting zabbix host.");
        return zabbixService.callZabbix("host.delete", hostIds, projectId);
    }

    public JsonNode getHosts(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Fetching host.");
        return zabbixService.callZabbix("host.get", params, projectId);
    }

    public Integer getHostsCount(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Counting host number.");
        JsonNode res = zabbixService.callZabbix("host.get", params, projectId);
        JsonNode resultnode = res.get("result");
        return resultnode.size();
    }

    public JsonNode massAddHost(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Adding host in mass.");
        return zabbixService.callZabbix("host.massadd", params, projectId);
    }

    public JsonNode massRemoveHost(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Removing host in mass.");
        return zabbixService.callZabbix("host.massremove", params, projectId);
    }

    public JsonNode massUpdateHost(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Updating host in mass.");
        return zabbixService.callZabbix("host.massupdate", params, projectId);
    }

    public JsonNode updateHost(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Updating host.");
        validateRequiredParam(params, "hostid");
        return zabbixService.callZabbix("host.update", params, projectId);
    }

    private void validateRequiredParam(Map<String, Object> params, String key) {
        if (!params.containsKey(key) || params.get(key) == null) {
            throw new IllegalArgumentException("Missing required parameter: " + key);
        }
    }

}

