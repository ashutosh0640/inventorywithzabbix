package com.ashutosh0640.inventy.controller;


import com.ashutosh0640.inventy.entity.ActivityLog;
import com.ashutosh0640.inventy.service.ActivityLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
public class ActivityLogController {

    private final ActivityLogService activityLogService;
    private final Logger LOGGER = LoggerFactory.getLogger(ActivityLogController.class);

    public ActivityLogController (ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public List<ActivityLog> getAllEntity() {
        return activityLogService.getAllEntity();
    }

    @GetMapping("/page")
    public Page<ActivityLog> getEntityByPage(@RequestParam(defaultValue = "0") Integer page,
                                             @RequestParam(defaultValue = "5") Integer size) {
        return activityLogService.getEntityByPage(page, size);
    }

    @GetMapping("/recent")
    public Page<ActivityLog> getRecentEntityByPage(@RequestParam(defaultValue = "0") Integer page,
                                                   @RequestParam(defaultValue = "5") Integer size) {
        return activityLogService.getRecentEntityByPage(page, size);
    }

}
