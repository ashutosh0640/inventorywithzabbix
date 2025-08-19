package com.ashutosh0640.inventy.dto;



import java.time.LocalDateTime;
import java.util.Set;

public class RackResponseDTO {

    private Long id;
    private String name;
    private Short totalSlot;
    private Long occupiedSlot;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocationResponseDTO location;
    private Set<BareMetalServerResponseDTO> server;
    private Set<NetworkDeviceResponseDTO> networkDevices;
    private Set<UserResponseDTO> user;

    public RackResponseDTO() { }

    public RackResponseDTO(Long id, String name, Short totalSlot, Long occupiedSlot, LocalDateTime createdAt, LocalDateTime updatedAt, LocationResponseDTO location, Set<BareMetalServerResponseDTO> server, Set<NetworkDeviceResponseDTO> networkDevices, Set<UserResponseDTO> user) {
        this.id = id;
        this.name = name;
        this.totalSlot = totalSlot;
        this.occupiedSlot = occupiedSlot;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.location = location;
        this.server = server;
        this.networkDevices = networkDevices;
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

    public Short getTotalSlot() {
        return totalSlot;
    }

    public void setTotalSlot(Short totalSlot) {
        this.totalSlot = totalSlot;
    }

    public Long getOccupiedSlot() {
        return occupiedSlot;
    }

    public void setOccupiedSlot(Long occupiedSlot) {
        this.occupiedSlot = occupiedSlot;
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

    public LocationResponseDTO getLocation() {
        return location;
    }

    public void setLocation(LocationResponseDTO location) {
        this.location = location;
    }

    public Set<BareMetalServerResponseDTO> getServer() {
        return server;
    }

    public void setServer(Set<BareMetalServerResponseDTO> server) {
        this.server = server;
    }

    public Set<NetworkDeviceResponseDTO> getNetworkDevices() {
        return networkDevices;
    }

    public void setNetworkDevices(Set<NetworkDeviceResponseDTO> networkDevices) {
        this.networkDevices = networkDevices;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
