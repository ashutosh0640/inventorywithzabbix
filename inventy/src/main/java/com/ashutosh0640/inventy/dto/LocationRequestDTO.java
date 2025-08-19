package com.ashutosh0640.inventy.dto;


import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public class LocationRequestDTO {

    @NotBlank(message = "Location name is required.")
    private String name;
    private Set<Long> userIds;

    public LocationRequestDTO() { }

    public LocationRequestDTO(String name, Set<Long> userIds) {
        this.name = name;
        this.userIds = userIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(Set<Long> userIds) {
        this.userIds = userIds;
    }
}

