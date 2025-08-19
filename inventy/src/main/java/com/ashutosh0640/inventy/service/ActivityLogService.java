package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.ActivityLog;
import com.ashutosh0640.inventy.enums.ActivityType;
import org.springframework.data.domain.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ashutosh0640.inventy.repository.ActivityLogRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repo;
    private final Logger LOGGER = LoggerFactory.getLogger(ActivityLogService.class);

    public ActivityLogService(ActivityLogRepository repo) {
        this.repo = repo;
    }

    public void createEntity(ActivityType activityType, String details) {
        LOGGER.info("Activity log creating...");
        String username = CustomUserDetailsService.getCurrentUsernameFromContext();
        ActivityLog log = new ActivityLog();
        log.setUsername(username);
        log.setActivityType(activityType);
        log.setTimestamp(LocalDateTime.now());
        log.setDetails(details);

        repo.save(log);
        LOGGER.info("Activity log created successfully.");
    }

    public List<ActivityLog> getAllEntity() {
        return repo.findAll();
    }

    public Page<ActivityLog> getEntityByPage(Integer page, Integer size) {

        // Default values
        int defaultSize = 10;
        int defaultPage = 0;

        // Validate `size`: must be non-null, > 0
        if (size == null || size <= 0 ) {
            size = defaultSize;
        }

        // Validate `page`: must be non-null and ≥ 0
        if (page == null || page < 0) {
            page = defaultPage;
        }

        Pageable pageable = PageRequest.of(page, size);
        return repo.findAll( pageable);
    }

    public Page<ActivityLog> getRecentEntityByPage(Integer page, Integer size) {
        // Default values
        int defaultSize = 10;
        int defaultPage = 0;

        if (size == null || size <= 0 ) {
            size = defaultSize;
        }

        if (page == null || page < 0) {
            page = defaultPage;
        }

        Pageable pageable = PageRequest.of(page, size);
        return repo.findRecentActivities(pageable);
    }

}
