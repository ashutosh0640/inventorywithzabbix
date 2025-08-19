package com.ashutosh0640.inventy.dto;


import java.time.LocalDateTime;
import java.util.Set;

public class LocationResponseDTO {

    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<RackResponseDTO> rack;
    private Set<ProjectResponseDTO> project;
    private Set<UserResponseDTO> user;

    public LocationResponseDTO() { }

    public LocationResponseDTO(Long id, String name, LocalDateTime createdAt, LocalDateTime updatedAt, Set<RackResponseDTO> rack, Set<ProjectResponseDTO> project, Set<UserResponseDTO> user) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.rack = rack;
        this.project = project;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<RackResponseDTO> getRack() {
        return rack;
    }

    public void setRack(Set<RackResponseDTO> rack) {
        this.rack = rack;
    }

    public Set<ProjectResponseDTO> getProject() {
        return project;
    }

    public void setProject(Set<ProjectResponseDTO> project) {
        this.project = project;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
