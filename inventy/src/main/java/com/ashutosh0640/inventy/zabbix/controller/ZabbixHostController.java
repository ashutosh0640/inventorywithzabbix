package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixHostService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/hosts")
public class ZabbixHostController {

    private final ZabbixHostService hostService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixHostController.class);

    public ZabbixHostController(ZabbixHostService hostService) {
        this.hostService = hostService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Getting request to create host.");
        return ResponseEntity.ok(hostService.createHost(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object hostIds) throws JsonProcessingException {
        LOGGER.info("Getting request to delete host.");
        return ResponseEntity.ok(hostService.deleteHost(projectId, hostIds));
    }

    @PostMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Getting request to fetch hosts.");
        return ResponseEntity.ok(hostService.getHosts(projectId, params));
    }


    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getHostsCount(@PathVariable Long projectId,
                                                 @RequestBody Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Getting request to fetch count of hosts.");
        return ResponseEntity.ok(hostService.getHostsCount(projectId, params));
    }


    @PostMapping("/massadd/{projectId}")
    public ResponseEntity<JsonNode> massAdd(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostService.massAddHost(projectId, params));
    }

    @PostMapping("/massremove/{projectId}")
    public ResponseEntity<JsonNode> massRemove(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostService.massRemoveHost(projectId, params));
    }

    @PostMapping("/massupdate/{projectId}")
    public ResponseEntity<JsonNode> massUpdate(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostService.massUpdateHost(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(hostService.updateHost(projectId, params));
    }
}
