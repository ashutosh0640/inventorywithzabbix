package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.ManagementType;

import java.time.LocalDateTime;
import java.util.Set;


public class BareMetalServerResponseDTO {

    private Long id;
    private HostType type;
    private String manufacturer;
    private String modelName;
    private String serialNumber;
    private Set<InterfaceDTO> interfaces;
    private ManagementType management;
    private RackResponseDTO rack;
    private Short rackSlotNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<VirtualizationsResponseDTO> vp;
    private Set<UserResponseDTO> user;

    public BareMetalServerResponseDTO() { }

    public BareMetalServerResponseDTO(Long id, HostType type, String manufacturer, String modelName, String serialNumber, Set<InterfaceDTO> interfaces, ManagementType management, RackResponseDTO rack, Short rackSlotNumber, LocalDateTime createdAt, LocalDateTime updatedAt, Set<VirtualizationsResponseDTO> vp, Set<UserResponseDTO> user) {
        this.id = id;
        this.type = type;
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.serialNumber = serialNumber;
        this.interfaces = interfaces;
        this.management = management;
        this.rack = rack;
        this.rackSlotNumber = rackSlotNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.vp = vp;
        this.user = user;
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

    public ManagementType getManagement() {
        return management;
    }

    public void setManagement(ManagementType management) {
        this.management = management;
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

    public Set<VirtualizationsResponseDTO> getVp() {
        return vp;
    }

    public void setVp(Set<VirtualizationsResponseDTO> vp) {
        this.vp = vp;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
