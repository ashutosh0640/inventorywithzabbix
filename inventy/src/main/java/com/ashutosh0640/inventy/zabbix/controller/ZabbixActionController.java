package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixActionService;
import com.ashutosh0640.inventy.zabbix.service.ZabbixHostService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/actions")
public class ZabbixActionController {

    private final ZabbixActionService actionService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixActionController.class);

    public ZabbixActionController(ZabbixActionService actionService) {
        this.actionService = actionService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(actionService.createAction(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object actionIds) throws JsonProcessingException {
        return ResponseEntity.ok(actionService.deleteAction(projectId, actionIds));
    }

    @PostMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(actionService.getActions(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(actionService.updateAction(projectId, params));
    }
}

