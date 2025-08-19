package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public class NetworkDeviceRequestDTO {


    @NotBlank(message = "Type is required.")
    private String type;

    @NotBlank(message = "Manufacturer name is required.")
    private String manufacturer;

    @NotBlank(message = "Model is required.")
    private String model;

    @NotBlank(message = "OS version is required.")
    private String osVersion;

    @NotBlank(message = "Serial number is required.")
    private String serialNumber;

    private Short numberOfPort;

    @NotBlank(message = "Interfaces is required.")
    private Set<InterfaceDTO> interfaces;

    @NotNull(message = "Rack ID is required")
    private Long rackId;

    @NotBlank(message = "Rack slot number is required.")
    private Short rackSlotNumber;

    private Set<Long> userIds;

    public NetworkDeviceRequestDTO() { }

    public NetworkDeviceRequestDTO(String type, String manufacturer, String model, String osVersion, String serialNumber, Short numberOfPort, Set<InterfaceDTO> interfaces, Long rackId, Short rackSlotNumber, Set<Long> userIds) {
        this.type = type;
        this.manufacturer = manufacturer;
        this.model = model;
        this.osVersion = osVersion;
        this.serialNumber = serialNumber;
        this.numberOfPort = numberOfPort;
        this.interfaces = interfaces;
        this.rackId = rackId;
        this.rackSlotNumber = rackSlotNumber;
        this.userIds = userIds;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
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

    public Set<InterfaceDTO> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(Set<InterfaceDTO> interfaces) {
        this.interfaces = interfaces;
    }

    public Long getRackId() {
        return rackId;
    }

    public void setRackId(Long rackId) {
        this.rackId = rackId;
    }

    public Short getRackSlotNumber() {
        return rackSlotNumber;
    }

    public void setRackSlotNumber(Short rackSlotNumber) {
        this.rackSlotNumber = rackSlotNumber;
    }

    public Set<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(Set<Long> userIds) {
        this.userIds = userIds;
    }


}
