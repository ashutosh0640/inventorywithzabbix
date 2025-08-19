package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.HostType;

import java.time.LocalDateTime;
import java.util.Set;


public class NetworkDeviceResponseDTO {

    private Long id;
    private HostType type;
    private String manufacturer;
    private String model;
    private String osVersion;
    private String serialNumber;
    private Short numberOfPort;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<InterfaceDTO> interfaces;
    private RackResponseDTO rack;
    private Short rackSlotNumber;
    private Set<UserResponseDTO> users;

    public NetworkDeviceResponseDTO() {}

    public NetworkDeviceResponseDTO(Long id, HostType type, String manufacturer, String model, String osVersion, String serialNumber, Short numberOfPort, LocalDateTime createdAt, LocalDateTime updatedAt, Set<InterfaceDTO> interfaces, RackResponseDTO rack, Short rackSlotNumber, Set<UserResponseDTO> users) {
        this.id = id;
        this.type = type;
        this.manufacturer = manufacturer;
        this.model = model;
        this.osVersion = osVersion;
        this.serialNumber = serialNumber;
        this.numberOfPort = numberOfPort;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.interfaces = interfaces;
        this.rack = rack;
        this.rackSlotNumber = rackSlotNumber;
        this.users = users;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HostType getType() {
        return type;
    }

    public void setType(HostType type) {
        this.type = type;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Short getNumberOfPort() {
        return numberOfPort;
    }

    public void setNumberOfPort(Short numberOfPort) {
        this.numberOfPort = numberOfPort;
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

    public Set<InterfaceDTO> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(Set<InterfaceDTO> interfaces) {
        this.interfaces = interfaces;
    }

    public RackResponseDTO getRack() {
        return rack;
    }

    public void setRack(RackResponseDTO rack) {
        this.rack = rack;
    }

    public Short getRackSlotNumber() {
        return rackSlotNumber;
    }

    public void setRackSlotNumber(Short rackSlotNumber) {
        this.rackSlotNumber = rackSlotNumber;
    }

    public Set<UserResponseDTO> getUsers() {
        return users;
    }

    public void setUsers(Set<UserResponseDTO> users) {
        this.users = users;
    }
}
