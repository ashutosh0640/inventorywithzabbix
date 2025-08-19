package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZabbixTemplateService {


    private final ZabbixService zabbixService; // Assuming you have this component
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixTemplateService.class);

    public ZabbixTemplateService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }


    public JsonNode createTemplate(Long projectId, Map<String, Object> templateData) throws JsonProcessingException {
        LOGGER.info("Creating template.");
        return zabbixService.callZabbix( "template.create", templateData, projectId);
    }

    public JsonNode updateTemplate(Long projectId, Map<String, Object> templateData) throws JsonProcessingException {
        LOGGER.info("Updating template.");
        return zabbixService.callZabbix("template.update", templateData, projectId);
    }

    public JsonNode deleteTemplate(Long projectId, List<String> templateIds) throws JsonProcessingException {
        LOGGER.info("Deleting templates.");
        Map<String, Object> params = new HashMap<>();
        params.put("templateids", templateIds);
        return zabbixService.callZabbix( "template.delete", params, projectId);
    }

    public JsonNode getTemplates(Long projectId, Map<String, Object> filterParams) throws JsonProcessingException {
        LOGGER.info("Fetching templates.");
        return zabbixService.callZabbix( "template.get", filterParams, projectId);
    }

    public Integer getTemplatesCount(Long projectId, Map<String, Object> params) {
        LOGGER.info("Counting template number.");
        return zabbixService.callZabbix("template.get", params, projectId)
                .get("result")
                .size();
    }

    public JsonNode massAddTemplates(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Adding templates in mass.");
        return zabbixService.callZabbix("template.massadd", params, projectId);
    }

    public JsonNode massRemoveTemplates(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Removing templates in mass.");
        return zabbixService.callZabbix("template.massremove", params, projectId);
    }

    public JsonNode massUpdateTemplates(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Updating templates in mass.");
        return zabbixService.callZabbix("template.massupdate", params, projectId);
    }
}

