package com.ashutosh0640.inventy.zabbix.service;

import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.service.CustomUserDetailsService;
import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;
import com.ashutosh0640.inventy.zabbix.repository.ZabbixServerRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ZabbixService {

    private final ZabbixServerRepository zabbixServerRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    public ZabbixService (ZabbixServerRepository zabbixServerRepo) {
        this.zabbixServerRepo = zabbixServerRepo;
    }

//    public JsonNode callZabbix(String method, Object params, Long projectId) {
//
//        // Project related zabbix url and token
//        ZabbixServer s = zabbixServerRepo.findByProjectId(projectId)
//                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by project id: "+projectId));
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("jsonrpc", "2.0");
//        request.put("method", method);
//        request.put("params", params);
//        request.put("auth", s.getToken());
//        request.put("id", UUID.randomUUID().toString());
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
//
//        try {
//            ResponseEntity<Map> response = restTemplate.postForEntity(s.getApiUrl(), entity, Map.class);
//            Map<String, Object> map = Map.of("Output", response.getBody());
//            return Optional.of(map);
//        } catch (Exception e) {
//            System.out.println("Zabbix API error: " + e.getMessage());
//            Map<String, Object> map = Map.of("Output",Optional.empty());
//            return Optional.of(map);
//        }
//    }


    public JsonNode callZabbix(String method, Object params, Long projectId) {
        ObjectMapper objectMapper = new ObjectMapper();

        Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();

        // Project related zabbix url and token
        ZabbixServer s = zabbixServerRepo.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by project id: " + projectId));

        Map<String, Object> request = new HashMap<>();
        request.put("jsonrpc", "2.0");
        request.put("method", method);
        request.put("params", params);
        request.put("auth", s.getToken());
        request.put("id", UUID.randomUUID().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(s.getUrl(), entity, String.class);
            String responseBody = response.getBody();
            // Parse response body into JsonNode
            return objectMapper.readTree(responseBody);
        } catch (Exception e) {
            System.out.println("Zabbix API error: " + e.getMessage());
            // Return an empty JsonNode or handle error as needed
            return objectMapper.createObjectNode();
        }
    }
}
