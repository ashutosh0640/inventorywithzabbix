package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixAlertService {

    private final ZabbixService zabbixService;

    public ZabbixAlertService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode getAlerts(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("alert.get", params, projectId);
    }
}

