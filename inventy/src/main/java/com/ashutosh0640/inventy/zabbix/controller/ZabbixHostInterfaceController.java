package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixHostInterfaceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zabbix/hostinterfaces")
public class ZabbixHostInterfaceController {

    private final ZabbixHostInterfaceService interfaceService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixHostInterfaceController.class);

    public ZabbixHostInterfaceController(ZabbixHostInterfaceService interfaceService) {
        this.interfaceService = interfaceService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.createInterface(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object interfaceIds) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.deleteInterface(projectId, interfaceIds));
    }

    @PostMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.getInterfaces(projectId, params));
    }

    @PostMapping("/massadd/{projectId}")
    public ResponseEntity<JsonNode> massAdd(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.massAddInterfaces(projectId, params));
    }

    @PostMapping("/massremove/{projectId}")
    public ResponseEntity<JsonNode> massRemove(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.massRemoveInterfaces(projectId, params));
    }

    @PostMapping("/replace/{projectId}")
    public ResponseEntity<JsonNode> replace(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.replaceHostInterfaces(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(interfaceService.updateInterface(projectId, params));
    }
}

