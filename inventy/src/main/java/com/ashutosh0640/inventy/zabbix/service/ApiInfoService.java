package com.ashutosh0640.inventy.zabbix.service;


import com.ashutosh0640.inventy.service.CustomUserDetailsService;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerResponseDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApiInfoService {

    private final ZabbixServerService zabbixServerService;
    private final RestTemplate restTemplate ;
    private final Logger LOGGER = LoggerFactory.getLogger(ApiInfoService.class);

    public ApiInfoService(ZabbixServerService zabbixServerService) {
        this.zabbixServerService = zabbixServerService;
        this.restTemplate = new RestTemplate();
    }

    public Boolean isZabbixServerActive(Long projectId) {
        ZabbixServerResponseDTO dto = zabbixServerService.findByProjectIdAndUserId(projectId);

        Map<String, Object> body = new HashMap<>();
        body.put("jsonrpc", "2.0");
        body.put("method.get", "apiinfo.version");
        body.put("id", 1);
        List<Object> params = new ArrayList<>();
        body.put("params", params);

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, header);

        String responseBody = restTemplate.postForEntity(dto.getUrl(), entity, String.class).getBody();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(responseBody);
            if(node.has("result")) {
                return true;
            }

        } catch(JsonProcessingException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        return false;

    }


}
