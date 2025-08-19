package com.ashutosh0640.inventy.dto;

import java.time.LocalDateTime;
import java.util.Set;


public class ProjectResponseDTO {

    private Long id; // Included for responses
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private Set<LocationResponseDTO> location;
    private Set<UserResponseDTO> user;

    public ProjectResponseDTO() {}

    public ProjectResponseDTO(Long id, String name, String description, LocalDateTime createdAt, Set<LocationResponseDTO> location, Set<UserResponseDTO> user) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.location = location;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<LocationResponseDTO> getLocation() {
        return location;
    }

    public void setLocation(Set<LocationResponseDTO> location) {
        this.location = location;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
