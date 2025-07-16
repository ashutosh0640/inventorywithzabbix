package com.ashutosh0640.inventy.zabbix.controller;


import com.ashutosh0640.inventy.zabbix.dto.DashboardDTO;
import com.ashutosh0640.inventy.zabbix.service.ZabbixDashboardService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/zabbix/dashboard")
public class ZabbixDashboardController {

    private final ZabbixDashboardService dashboardService;

    public ZabbixDashboardController(ZabbixDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    @GetMapping("/details/{projectId}")
    public ResponseEntity<DashboardDTO> getDashboardDetails(@PathVariable Long projectId) throws JsonProcessingException {
        DashboardDTO dto = dashboardService.getDashboardDetails(projectId);
        return ResponseEntity.ok(dto);
    }
}
