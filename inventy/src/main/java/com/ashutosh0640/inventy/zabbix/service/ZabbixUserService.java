package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ZabbixUserService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixUserService.class);

    public ZabbixUserService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode checkAuthentication(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Checking authentication.");
        return zabbixService.callZabbix("user.checkAuthentication", params, projectId);
    }

    public JsonNode createUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Creating user.");
        return zabbixService.callZabbix("user.create", params, projectId);
    }

    public JsonNode deleteUser(Long projectId, Object params) throws JsonProcessingException {
        LOGGER.info("Deleting user.");
        return zabbixService.callZabbix("user.delete", params, projectId);
    }

    public JsonNode getUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Fetching user.");
        return zabbixService.callZabbix("user.get", params, projectId);
    }

    public Integer getUserCount(Long projectId, Map<String, Object> params) {
        LOGGER.info("Getting user count.");
        return zabbixService.callZabbix("user.get", params, projectId).get("result").size();
    }

    public JsonNode loginUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.login", params, projectId);
    }

    public JsonNode logoutUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.logout", params, projectId);
    }

    public JsonNode provisionUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.provision", params, projectId);
    }

    public JsonNode resetTotp(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.resettotp", params, projectId);
    }

    public JsonNode unblockUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.unblock", params, projectId);
    }

    public JsonNode updateUser(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("user.update", params, projectId);
    }
}

