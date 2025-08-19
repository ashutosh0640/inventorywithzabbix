package com.ashutosh0640.inventy.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;


public class BareMetalServerRequestDTO {


    @NotBlank(message = "Type is required.")
    private String type;

    private String management;

    @NotBlank(message = "Brand name is required.")
    private String manufacturer;

    @NotBlank(message = "Model name is required.")
    private String modelName;

    @NotBlank(message = "Serial number is required.")
    private String serialNumber;

    @NotBlank(message = "Interfaces is required.")
    private Set<InterfaceDTO> interfaces;

    @NotNull(message = "Rack ID is required")
    private Long rackId;

    private Short rackSlotNumber;

    private Set<Long> userIds;

    public BareMetalServerRequestDTO() { }

    public BareMetalServerRequestDTO(String type, String management, String manufacturer, String modelName, String serialNumber, Set<InterfaceDTO> interfaces, Long rackId, Short rackSlotNumber, Set<Long> userIds) {
        this.type = type;
        this.management = management;
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.serialNumber = serialNumber;
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

    public String getManagement() {
        return management;
    }

    public void setManagement(String management) {
        this.management = management;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
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
