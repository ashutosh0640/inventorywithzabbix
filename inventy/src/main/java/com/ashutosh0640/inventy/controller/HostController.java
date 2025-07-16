package com.ashutosh0640.inventy.controller;


import com.ashutosh0640.inventy.service.HostService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hosts")
public class HostController {


    private final HostService hostService;

    public HostController(HostService hostService) {
        this.hostService = hostService;
    }


    @GetMapping("/count/{status}")
    public Long hostCount(@RequestParam String type, @PathVariable String status) {
        return hostService.countHost(type, status);
    }
}
