package com.ashutosh0640.inventy.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public class RackRequestDTO {

    @NotBlank(message = "Rack name is required")
    private String name;

    private Short totalSlot;

    @NotNull(message = "Location id is required")
    private Long locationId;

    private Set<Long> usersId;

    public RackRequestDTO() {}

    public RackRequestDTO(String name, Short totalSlot, Long locationId, Set<Long> usersId) {
        this.name = name;
        this.totalSlot = totalSlot;
        this.locationId = locationId;
        this.usersId = usersId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Short getTotalSlot() {
        return totalSlot;
    }

    public void setTotalSlot(Short totalSlot) {
        this.totalSlot = totalSlot;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Set<Long> getUsersId() {
        return usersId;
    }

    public void setUsersId(Set<Long> usersId) {
        this.usersId = usersId;
    }
}
