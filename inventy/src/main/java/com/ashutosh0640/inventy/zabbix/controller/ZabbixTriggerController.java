package com.ashutosh0640.inventy.zabbix.controller;


import com.ashutosh0640.inventy.zabbix.service.ZabbixTriggerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zabbix/triggers")
public class ZabbixTriggerController {

    private final ZabbixTriggerService triggerService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixTriggerController.class);

    public ZabbixTriggerController(ZabbixTriggerService triggerService) {
        this.triggerService = triggerService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(triggerService.createTrigger(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object triggerIds) throws JsonProcessingException {
        return ResponseEntity.ok(triggerService.deleteTrigger(projectId, triggerIds));
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(triggerService.getTriggers(projectId, params));
    }

    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getTriggersCount(@PathVariable Long projectId,
                                                    @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(triggerService.getTriggersCount(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(triggerService.updateTrigger(projectId, params));
    }
}

