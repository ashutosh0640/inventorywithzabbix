package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixAlertService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zabbix/alerts")
public class ZabbixAlertController {

    private final ZabbixAlertService alertService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixAlertController.class);

    public ZabbixAlertController(ZabbixAlertService alertService) {
        this.alertService = alertService;
    }

    @PostMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> getAlerts(@PathVariable Long projectId,
                                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(alertService.getAlerts(projectId, params));
    }
}

