package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.entity.User;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class GroupResponseDTO {

    private Long id;
    private String name;

    private String description;
    private UserResponseDTO createdBy;
    private LocalDateTime createdAt;

    private boolean active = true;
    private Set<GroupMembersResponseDTO> members = new HashSet<>();

    public GroupResponseDTO() {    }

    public GroupResponseDTO(
            Long id,
            String name,
            String description,
            UserResponseDTO createdBy,
            LocalDateTime createdAt,
            boolean active,
            Set<GroupMembersResponseDTO> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.active = active;
        this.members = members;
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

    public UserResponseDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponseDTO createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Set<GroupMembersResponseDTO> getMembers() {
        return members;
    }

    public void setMembers(Set<GroupMembersResponseDTO> members) {
        this.members = members;
    }
}
