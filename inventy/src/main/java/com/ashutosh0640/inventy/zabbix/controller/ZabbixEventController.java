package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixEventService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/zabbix/event")
public class ZabbixEventController {

    private ZabbixEventService zabbixEventService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixEventController.class);

    public ZabbixEventController(ZabbixEventService zabbixEventService) {
        this.zabbixEventService = zabbixEventService;
    }

    @GetMapping("/acknowledge/{projectId}")
    public JsonNode acknowledgeEvents(@PathVariable Long projectId,
                                      @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return zabbixEventService.acknowledgeEvents( projectId, params);
    }

    @GetMapping("/get/{projectId}")
    public JsonNode getEvents(@PathVariable Long projectId,
                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return zabbixEventService.getEvents(projectId, params);
    }
}
