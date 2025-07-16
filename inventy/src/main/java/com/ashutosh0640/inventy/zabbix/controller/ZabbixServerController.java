package com.ashutosh0640.inventy.zabbix.controller;


import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerRequestDTO;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerResponseDTO;
import com.ashutosh0640.inventy.zabbix.service.ZabbixServerService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/zabbix/server")
public class ZabbixServerController {

    private final ZabbixServerService zabbixServerService;
    private final Logger LOGGER = LoggerFactory.getLogger(ZabbixServerController.class);

    public ZabbixServerController(ZabbixServerService zabbixServerService) {
        this.zabbixServerService = zabbixServerService;
    }

    @PostMapping
    public ResponseEntity<ZabbixServerResponseDTO> saveEntity(@RequestBody ZabbixServerRequestDTO dto) {
        ZabbixServerResponseDTO response = zabbixServerService.saveEntity(dto);
        return ResponseEntity.ok(response);
    }

    @Transactional
    @PostMapping("/save")
    public void saveAllEntity(@RequestBody Set<ZabbixServerRequestDTO> dtos) {
        zabbixServerService.saveAllEntity(dtos);
    }

    @GetMapping("/id")
    public ResponseEntity<ZabbixServerResponseDTO> getEntityById(@RequestParam Long id) {
        ZabbixServerResponseDTO response = zabbixServerService.getEntityById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name")
    public ResponseEntity<ZabbixServerResponseDTO> getEntityByName(@RequestParam String name) {
        ZabbixServerResponseDTO response = zabbixServerService.getEntityByName(name);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ZabbixServerResponseDTO>> findByUserId() {
        List<ZabbixServerResponseDTO> response = zabbixServerService.findByUserId();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project")
    public ResponseEntity<ZabbixServerResponseDTO> findByProjectIdAndUserId(@RequestParam Long projectId) {
        ZabbixServerResponseDTO response = zabbixServerService.findByProjectIdAndUserId(projectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> serverCount() {
        Long count = zabbixServerService.serverCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/online")
    public ResponseEntity<Long> countOnlineZabbixServer() {
        Long count = zabbixServerService.countOnlineZabbixServer();
        return ResponseEntity.ok(count);
    }



    @GetMapping
    public ResponseEntity<Set<ZabbixServerResponseDTO>> getAllEntity() {
        Set<ZabbixServerResponseDTO> response = zabbixServerService.getAllEntity();
        return ResponseEntity.ok(response);
    }


    @PutMapping
    public ResponseEntity<ZabbixServerResponseDTO> editEntity(@RequestParam Long id, @RequestBody ZabbixServerRequestDTO dto) {
        ZabbixServerResponseDTO response = zabbixServerService.editEntity(id, dto);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/id")
    public void deleteEntityById(@RequestParam Long id) {
        zabbixServerService.deleteEntityById(id);
    }


    @DeleteMapping
    public void deleteAllEntity() {
        zabbixServerService.deleteAllEntity();
    }

}
