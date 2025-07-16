package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class ZabbixEventService {

    private final ZabbixService zabbixService;

    public ZabbixEventService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode acknowledgeEvents(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("event.acknowledge", params, projectId);
    }

    public JsonNode getEvents(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("event.get", params, projectId);
    }


}
