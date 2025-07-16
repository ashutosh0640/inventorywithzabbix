package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.DashboardDTO;
import com.ashutosh0640.inventy.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    @GetMapping("/details")
    public DashboardDTO dashboardDetails() {
        return dashboardService.dashboardDetails();
    }


}
