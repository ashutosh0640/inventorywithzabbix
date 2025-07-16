package com.ashutosh0640.inventy.zabbix.service;


import com.ashutosh0640.inventy.entity.Project;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.repository.ProjectRepository;
import com.ashutosh0640.inventy.service.CustomUserDetailsService;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerRequestDTO;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerResponseDTO;
import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;
import com.ashutosh0640.inventy.zabbix.mapper.ZabbixServerMapper;
import com.ashutosh0640.inventy.zabbix.repository.ZabbixServerRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

@Service
public class ZabbixServerService {

    private final ZabbixServerRepository repository;
    private final ProjectRepository projectRepo;
    private final ExecutorService executor;
    private final RestTemplate restTemplate = new RestTemplate();
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixServerService.class);

    public ZabbixServerService(ZabbixServerRepository repository,
                               ProjectRepository projectRepo,
                               ExecutorService executor) {
        this.repository = repository;
        this.projectRepo = projectRepo;
        this.executor = executor;
    }

    public ZabbixServerResponseDTO saveEntity(ZabbixServerRequestDTO dto) {
        Project project = projectRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found by id: "+dto.getProjectId()));
        ZabbixServer entity = ZabbixServerMapper.toEntity(dto, project);
        entity = repository.save(entity);

        return ZabbixServerMapper.toDTO(entity, entity.getProject());

    }

    public void saveAllEntity(Set<ZabbixServerRequestDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new RuntimeException("Zabbix server details is null or empty.");
        }

        List<ZabbixServer> entities = dtos.stream().map(dto -> {
            Project project = projectRepo.findById(dto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found by id: "+dto.getProjectId()));
            return ZabbixServerMapper.toEntity(dto, project);
        }).toList();
        repository.saveAll(entities);
    }

    public ZabbixServerResponseDTO getEntityById(Long id) {
        ZabbixServer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by id: "+ id));
        return ZabbixServerMapper.toDTO(entity, entity.getProject());
    }

    public ZabbixServerResponseDTO getEntityByName(String name) {
        ZabbixServer entity = repository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by name: "+ name));
        return ZabbixServerMapper.toDTO(entity, entity.getProject());
    }

    public List<ZabbixServerResponseDTO> findByUserId() {
        Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        List<ZabbixServer> entities = repository.findByUser(userId);
        return entities.stream().map(ZabbixServerMapper::toDTO).toList();
    }

    public Long getServerCount() {
        return repository.count();
    }

    public ZabbixServerResponseDTO findByProjectIdAndUserId(Long projectId) {
        Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        ZabbixServer entity = repository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by project id: "+projectId));
        return ZabbixServerMapper.toDTO(entity, entity.getProject());
    }


    public Set<ZabbixServerResponseDTO> getAllEntity() {
        List<ZabbixServer> entities =  repository.findAll();
        return entities.stream().map(entity -> {
            return ZabbixServerMapper.toDTO(entity, entity.getProject());
        }).collect(Collectors.toSet());
    }

    public Long serverCount() {
        return repository.count();
    }

    public Long countOnlineZabbixServer() {
        return repository.countOnlineZabbixServer();
    }

    public ZabbixServerResponseDTO editEntity(Long id, ZabbixServerRequestDTO dto) {
        ZabbixServer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zabbix server not found by id: "+ id));

        Project project = projectRepo.findById(dto.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found by id: "+ dto.getToken()));

        entity.setName(dto.getName());
        entity.setUrl(dto.getUrl());
        entity.setUsername(dto.getUsername());
        entity.setPassword(dto.getPassword());
        entity.setToken(dto.getToken());
        entity.setProject(project);
        entity = repository.save(entity);

        return ZabbixServerMapper.toDTO(entity, entity.getProject());
    }

    public void deleteEntityById(Long id) {
        repository.deleteById(id);
    }

    public void deleteAllEntity() {
        repository.deleteAll();
    }


    public String checkConnectivity(String url, String token) {
        Map<String, Object> body = new HashMap<>();
        body.put("jsonrpc", "2.0");
        body.put("method", "authentication.get");
        Map<String, Object> params = new HashMap<>();
        params.put("output", "extend");
        body.put("params", params);
        body.put("auth", token);
        body.put("id", UUID.randomUUID().toString());

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity httpEntity = new HttpEntity(body, header);
        ResponseEntity<String> response = restTemplate.postForEntity(url, httpEntity, String.class);
        String responseBody = response.getBody();
        System.out.println("ResponseBody: "+ responseBody);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(responseBody);

            // Check if response has "error"
            if (rootNode.has("error")) {
                String errorData = rootNode.path("error").path("data").asText();

                if (errorData.contains("API token expired")) {
                    return "API token expired.";
                } else if (errorData.contains("Not authorized")) {
                    return "Not authorized.";
                } else {
                    return "Error: " + errorData; // fallback for other errors
                }
            }
            // Check if response has "result"
            else if (rootNode.has("result")) {
                return "Connected".toUpperCase();
            } else {
                return "Unknown response"; // fallback for unexpected response structure
            }
        } catch (Exception e) {
            return "Invalid URL";
        }
    }


    public boolean checkReachability(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000); // 5 seconds timeout
            connection.setReadTimeout(5000);
            int responseCode = connection.getResponseCode();
            return (responseCode >= 200 && responseCode < 400);
        } catch (Exception e) {
            return false;
        }
    }


    @Scheduled(fixedRate = 86400000)    // Every day
    public void updateZabbixServerStatus() {
        List<ZabbixServer> servers = repository.findAll();

        List<Callable<Void>> tasks = servers.stream().map(s -> (Callable<Void>) () -> {
            String url = s.getUrl();
            String token = s.getToken();
            String flag = checkConnectivity(url, token);
            repository.updateStatus(s.getId(), flag);
            return null;
        }).toList();

        try {
            executor.invokeAll(tasks);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Zabbix server status check thread pool interrupted: " + e.getMessage());
        }

    }
}
