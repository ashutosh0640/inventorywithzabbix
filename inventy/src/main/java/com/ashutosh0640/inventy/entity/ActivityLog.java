package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.ActivityType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name="activity_type", nullable = false)
    private ActivityType activityType;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String details;

    public ActivityLog() {}

    public ActivityLog(Long id, String username, ActivityType activityType, LocalDateTime timestamp, String details) {
        this.id = id;
        this.username = username;
        this.activityType = activityType;
        this.timestamp = timestamp;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
