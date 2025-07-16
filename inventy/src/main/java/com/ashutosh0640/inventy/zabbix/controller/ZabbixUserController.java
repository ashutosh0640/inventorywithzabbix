package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixUserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/users")
public class ZabbixUserController {

    private final ZabbixUserService zabbixUserService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixUserController.class);

    public ZabbixUserController(ZabbixUserService zabbixUserService) {
        this.zabbixUserService = zabbixUserService;
    }

    @PostMapping("/check-authentication/{projectId}")
    public ResponseEntity<JsonNode> checkAuthentication(@PathVariable Long projectId,
                                                        @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.checkAuthentication(projectId, params));
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<JsonNode> createUser(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.createUser(projectId, params));
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<JsonNode> deleteUser(@PathVariable Long projectId,
                                               @RequestBody Object params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.deleteUser(projectId, params));
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> getUser(@PathVariable Long projectId,
                                            @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.getUser(projectId, params));
    }

    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getUserCount(@PathVariable Long projectId,
                                                @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.getUserCount(projectId, params));
    }

    @PostMapping("/login/{projectId}")
    public ResponseEntity<JsonNode> loginUser(@PathVariable Long projectId,
                                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.loginUser(projectId, params));
    }

    @PostMapping("/logout/{projectId}")
    public ResponseEntity<JsonNode> logoutUser(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.logoutUser(projectId, params));
    }

    @PostMapping("/provision/{projectId}")
    public ResponseEntity<JsonNode> provisionUser(@PathVariable Long projectId,
                                                  @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.provisionUser(projectId, params));
    }

    @PostMapping("/resettotp/{projectId}")
    public ResponseEntity<JsonNode> resetTotp(@PathVariable Long projectId,
                                              @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.resetTotp(projectId, params));
    }

    @PostMapping("/unblock/{projectId}")
    public ResponseEntity<JsonNode> unblockUser(@PathVariable Long projectId,
                                                @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.unblockUser(projectId, params));
    }

    @PutMapping("/update/{projectId}")
    public ResponseEntity<JsonNode> updateUser(@PathVariable Long projectId,
                                               @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(zabbixUserService.updateUser(projectId, params));
    }
}

