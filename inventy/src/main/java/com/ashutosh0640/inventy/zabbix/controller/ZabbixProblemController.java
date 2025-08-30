package com.ashutosh0640.inventy.zabbix.controller;

import com.ashutosh0640.inventy.zabbix.service.ZabbixProblemService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zabbix/problems")
public class ZabbixProblemController {

    private final ZabbixProblemService problemService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixProblemController.class);

    public ZabbixProblemController(ZabbixProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<JsonNode> getProblems(@PathVariable Long projectId,
                                                @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(problemService.getProblems(projectId, params));
    }

    @GetMapping("/count/{projectId}")
    public ResponseEntity<Integer> getProblemsCount(@PathVariable Long projectId,
                                                    @RequestBody Map<String, Object> params) throws JsonProcessingException {
        return ResponseEntity.ok(problemService.getProblemsCount(projectId, params));
    }
}

