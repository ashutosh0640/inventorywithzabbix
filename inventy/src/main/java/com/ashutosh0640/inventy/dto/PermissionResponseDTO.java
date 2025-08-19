package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.ResourceType;

import java.util.Set;


public class PermissionResponseDTO {

    private Long id;
    private String name; // e.g., "READ_USER", "WRITE_PROJECT"
    private String description;
    private ResourceType resourceType; // USER, PROJECT, SERVER, VM
    private Set<RoleResponseDTO> role;

    public PermissionResponseDTO() {}

    public PermissionResponseDTO(Long id, String name, String description, ResourceType resourceType, Set<RoleResponseDTO> role) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.resourceType = resourceType;
        this.role = role;
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

    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public Set<RoleResponseDTO> getRole() {
        return role;
    }

    public void setRole(Set<RoleResponseDTO> role) {
        this.role = role;
    }
}
