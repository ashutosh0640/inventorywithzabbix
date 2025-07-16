package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixHostGroupService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/hostgroups")
public class ZabbixHostGroupController {

    private final ZabbixHostGroupService hostGroupService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixHostGroupController.class);

    public ZabbixHostGroupController(ZabbixHostGroupService hostGroupService) {
        this.hostGroupService = hostGroupService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.createHostGroup(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object ids) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.deleteHostGroup(projectId, ids));
    }

    @PostMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.getHostGroups(projectId, params));
    }

    @PostMapping("/massadd/{projectId}")
    public ResponseEntity<JsonNode> massAdd(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.massAddHostGroups(projectId, params));
    }

    @PostMapping("/massremove/{projectId}")
    public ResponseEntity<JsonNode> massRemove(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.massRemoveHostGroups(projectId, params));
    }

    @PostMapping("/massupdate/{projectId}")
    public ResponseEntity<JsonNode> massUpdate(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.massUpdateHostGroups(projectId, params));
    }

    @PostMapping("/propagate/{projectId}")
    public ResponseEntity<JsonNode> propagate(@PathVariable Long projectId,
                                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.propagateHostGroup(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostGroupService.updateHostGroup(projectId, params));
    }
}
