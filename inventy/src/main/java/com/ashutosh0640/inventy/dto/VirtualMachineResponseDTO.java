package com.ashutosh0640.inventy.dto;


import com.ashutosh0640.inventy.enums.*;

import java.time.LocalDateTime;
import java.util.Set;

public class VirtualMachineResponseDTO {

    private Long id;
    private String hostName;
    private HostType hostType;
    private OsType os;
    private String osVersion;
    private Set<InterfaceDTO> interfaces;
    private String cpuModel;
    private int cpuCores;
    private int ramSize;
    private StorageUnit ramSizeUnit;
    private int storageSize;
    private StorageUnit storageSizeUnit;
    private StorageType storageType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private VirtualizationsResponseDTO vp;
    private Set<UserResponseDTO> user;

    public VirtualMachineResponseDTO() {}

    public VirtualMachineResponseDTO(Long id, HostType hostType, OsType os, String osVersion, Set<InterfaceDTO> interfaces, String cpuModel, int cpuCores, int ramSize, StorageUnit ramSizeUnit, int storageSize, StorageUnit storageSizeUnit, StorageType storageType, LocalDateTime createdAt, LocalDateTime updatedAt, VirtualizationsResponseDTO vp, Set<UserResponseDTO> user) {
        this.id = id;
        this.hostType = hostType;
        this.os = os;
        this.osVersion = osVersion;
        this.interfaces = interfaces;
        this.cpuModel = cpuModel;
        this.cpuCores = cpuCores;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storageType = storageType;
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

    public HostType getHostType() {
        return hostType;
    }

    public void setHostType(HostType hostType) {
        this.hostType = hostType;
    }

    public OsType getOs() {
        return os;
    }

    public void setOs(OsType os) {
        this.os = os;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
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

    public int getCpuCores() {
        return cpuCores;
    }

    public void setCpuCores(int cpuCores) {
        this.cpuCores = cpuCores;
    }

    public int getRamSize() {
        return ramSize;
    }

    public void setRamSize(int ramSize) {
        this.ramSize = ramSize;
    }

    public StorageUnit getRamSizeUnit() {
        return ramSizeUnit;
    }

    public void setRamSizeUnit(StorageUnit ramSizeUnit) {
        this.ramSizeUnit = ramSizeUnit;
    }

    public int getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(int storageSize) {
        this.storageSize = storageSize;
    }

    public StorageUnit getStorageSizeUnit() {
        return storageSizeUnit;
    }

    public void setStorageSizeUnit(StorageUnit storageSizeUnit) {
        this.storageSizeUnit = storageSizeUnit;
    }

    public StorageType getStorageType() {
        return storageType;
    }

    public void setStorageType(StorageType storageType) {
        this.storageType = storageType;
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

    public VirtualizationsResponseDTO getVp() {
        return vp;
    }

    public void setVp(VirtualizationsResponseDTO vp) {
        this.vp = vp;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
