package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public class VirtualizationsRequestDTO {

    private String hostType;
    @NotBlank(message = "Virtualization type is required.")
    private String type; // e.g., ESXi, KVM
    @NotBlank(message = "Version is required.")
    private String version;
    private Set<InterfaceDTO> interfaces;
    private String cpuModel;
    @NotBlank(message = "CPU is required.")
    private Integer cpuCores;
    @NotBlank(message = "Ram size is required.")
    private Integer ramSize;
    @NotBlank(message = "Ram unit is required.")
    private String ramSizeUnit;
    @NotBlank(message = "Storage size is required.")
    private Integer storageSize;
    @NotBlank(message = "Storage unit is required.")
    private String storageSizeUnit;
    @NotBlank(message = "Storage type is required.")
    private  String storeageType;
    @NotBlank(message = "Bare metal id is required.")
    private Long serverId;
    private Set<Long> usersId;

    public VirtualizationsRequestDTO() {    }

    public VirtualizationsRequestDTO(String hostType, String type, String version, Set<InterfaceDTO> interfaces, String cpuModel, Integer cpuCores, Integer ramSize, String ramSizeUnit, Integer storageSize, String storageSizeUnit, String storeageType, Long serverId, Set<Long> usersId) {
        this.hostType = hostType;
        this.type = type;
        this.version = version;
        this.interfaces = interfaces;
        this.cpuModel = cpuModel;
        this.cpuCores = cpuCores;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storeageType = storeageType;
        this.serverId = serverId;
        this.usersId = usersId;
    }

    public String getHostType() {
        return hostType;
    }

    public void setHostType(String hostType) {
        this.hostType = hostType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Set<InterfaceDTO> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(Set<InterfaceDTO> interfaces) {
        this.interfaces = interfaces;
    }

    public String getCpuModel() {
        return cpuModel;
    }

    public void setCpuModel(String cpuModel) {
        this.cpuModel = cpuModel;
    }

    public Integer getCpuCores() {
        return cpuCores;
    }

    public void setCpuCores(Integer cpuCores) {
        this.cpuCores = cpuCores;
    }

    public Integer getRamSize() {
        return ramSize;
    }

    public void setRamSize(Integer ramSize) {
        this.ramSize = ramSize;
    }

    public String getRamSizeUnit() {
        return ramSizeUnit;
    }

    public void setRamSizeUnit(String ramSizeUnit) {
        this.ramSizeUnit = ramSizeUnit;
    }

    public Integer getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(Integer storageSize) {
        this.storageSize = storageSize;
    }

    public String getStorageSizeUnit() {
        return storageSizeUnit;
    }

    public void setStorageSizeUnit(String storageSizeUnit) {
        this.storageSizeUnit = storageSizeUnit;
    }

    public String getStoreageType() {
        return storeageType;
    }

    public void setStoreageType(String storeageType) {
        this.storeageType = storeageType;
    }

    public Long getServerId() {
        return serverId;
    }

    public void setServerId(Long serverId) {
        this.serverId = serverId;
    }

    public Set<Long> getUsersId() {
        return usersId;
    }

    public void setUsersId(Set<Long> usersId) {
        this.usersId = usersId;
    }
}
