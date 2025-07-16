package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixItemService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/items")
public class ZabbixItemController {

    private final ZabbixItemService itemService;

    public ZabbixItemController(ZabbixItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> create(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.createItem(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> delete(@PathVariable Long projectId,
                                           @RequestBody Object itemIds) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.deleteItem(projectId, itemIds));
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> get(@PathVariable Long projectId,
                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.getItems(projectId, params));
    }

    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getItemsCount(@PathVariable Long projectId,
                                                 @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.getItemsCount(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> update(@PathVariable Long projectId,
                                           @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.updateItem(projectId, params));
    }
}

