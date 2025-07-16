package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixTemplateGroupService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/templategroups")
public class ZabbixTemplateGroupController {

    private final ZabbixTemplateGroupService templateGroupService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixTemplateGroupController.class);

    public ZabbixTemplateGroupController(ZabbixTemplateGroupService templateGroupService) {
        this.templateGroupService = templateGroupService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.createTemplateGroup(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.deleteTemplateGroup(projectId, params));
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.getTemplateGroups(projectId, params));
    }

    @PostMapping("/massadd/{projectId}")
    public ResponseEntity<JsonNode> massAdd(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.massAddTemplateGroups(projectId, params));
    }

    @PostMapping("/massremove/{projectId}")
    public ResponseEntity<JsonNode> massRemove(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.massRemoveTemplateGroups(projectId, params));
    }

    @PostMapping("/massupdate/{projectId}")
    public ResponseEntity<JsonNode> massUpdate(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.massUpdateTemplateGroups(projectId, params));
    }

    @PostMapping("/propagate/{projectId}")
    public ResponseEntity<JsonNode> propagate(@PathVariable Long projectId,
                                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.propagateTemplateGroup(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(templateGroupService.updateTemplateGroup(projectId, params));
    }
}

