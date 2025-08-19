package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;


public class PermissionRequestDTO {

    @NotBlank(message = "Name is required.")
    private String name; // e.g., "READ_USER", "WRITE_PROJECT"

    private String description;

    @NotBlank(message = "Resource is required.")
    private String resourceType; // USER, PROJECT, SERVER, VM

    private Set<Integer> roleIds;

    public PermissionRequestDTO() {}

    public PermissionRequestDTO(String name, String description, String resourceType, Set<Integer> roleIds) {
        this.name = name;
        this.description = description;
        this.resourceType = resourceType;
        this.roleIds = roleIds;
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

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Set<Integer> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(Set<Integer> roleIds) {
        this.roleIds = roleIds;
    }


}
