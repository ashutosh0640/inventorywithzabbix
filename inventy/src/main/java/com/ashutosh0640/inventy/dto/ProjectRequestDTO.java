package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class ProjectRequestDTO {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 255, message = "Project name must be between 2 and 255 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private Set<Long> locationIds;
    private Set<Long> usersId;

    public ProjectRequestDTO() {}

    public ProjectRequestDTO(String name, String description, Set<Long> locationIds, Set<Long> usersId) {
        this.name = name;
        this.description = description;
        this.locationIds = locationIds;
        this.usersId = usersId;
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

    public Set<Long> getLocationIds() {
        return locationIds;
    }

    public void setLocationIds(Set<Long> locationIds) {
        this.locationIds = locationIds;
    }

    public Set<Long> getUsersId() {
        return usersId;
    }

    public void setUsersId(Set<Long> usersId) {
        this.usersId = usersId;
    }
}