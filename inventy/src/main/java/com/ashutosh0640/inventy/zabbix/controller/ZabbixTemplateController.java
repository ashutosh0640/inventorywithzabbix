package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixTemplateService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/templates")
public class ZabbixTemplateController {


    private final ZabbixTemplateService zabbixTemplateService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixTemplateController.class);

    public ZabbixTemplateController(ZabbixTemplateService zabbixTemplateService) {
        this.zabbixTemplateService = zabbixTemplateService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> createTemplate(@PathVariable Long projectId,
                                                   @RequestBody Map<String, Object> templateData) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.createTemplate(projectId, templateData));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> updateTemplate(@PathVariable Long projectId,
                                                   @RequestBody Map<String, Object> templateData) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.updateTemplate(projectId, templateData));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> deleteTemplate(@PathVariable Long projectId,
                                                   @RequestBody List<String> templateIds) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.deleteTemplate(projectId, templateIds));
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> getTemplates(@PathVariable Long projectId,
                                                 @RequestBody Map<String, Object> filterParams) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.getTemplates(projectId, filterParams));
    }

    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getTemplatesCount(@PathVariable Long projectId,
                                                     @RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(zabbixTemplateService.getTemplatesCount(projectId, params));
    }

    @PostMapping("/massadd/{projectId}")
    public ResponseEntity<JsonNode> massAddTemplates(@PathVariable Long projectId,
                                                     @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.massAddTemplates(projectId, params));
    }

    @PostMapping("/massremove/{projectId}")
    public ResponseEntity<JsonNode> massRemoveTemplates(@PathVariable Long projectId,
                                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.massRemoveTemplates(projectId, params));
    }

    @PostMapping("/massupdate/{projectId}")
    public ResponseEntity<JsonNode> massUpdateTemplates(@PathVariable Long projectId,
                                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixTemplateService.massUpdateTemplates(projectId, params));
    }
}

