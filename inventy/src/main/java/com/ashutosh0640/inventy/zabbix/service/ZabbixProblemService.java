package com.ashutosh0640.inventy.zabbix.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ZabbixProblemService {

    private final ZabbixService zabbixService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixProblemService.class);

    public ZabbixProblemService(ZabbixService zabbixService) {
        this.zabbixService = zabbixService;
    }

    public JsonNode getProblems(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        return zabbixService.callZabbix("problem.get", params, projectId);
    }

    public Integer getProblemsCount(Long projectId, Map<String, Object> params) throws JsonProcessingException {
        LOGGER.info("Counting problems number.");
        JsonNode res = zabbixService.callZabbix("problem.get", params, projectId);
        res = res.get("result");
        return res.size();
    }


}

