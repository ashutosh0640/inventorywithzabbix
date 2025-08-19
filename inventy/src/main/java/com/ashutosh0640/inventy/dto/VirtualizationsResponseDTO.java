package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.*;

import java.time.LocalDateTime;
import java.util.Set;


public class VirtualizationsResponseDTO {

    private Long id;
    private HostType hostType;
    private VirtualizationType type;
    private String version;
    private Set<InterfaceDTO> interfaces;
    private String cpuModel;
    private Integer cpuCores;
    private Integer ramSize;
    private StorageUnit ramSizeUnit;
    private Integer storageSize;
    private StorageUnit storageSizeUnit;
    private StorageType storageType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BareMetalServerResponseDTO server;
    private Set<VirtualMachineResponseDTO> vm;
    private Set<UserResponseDTO> user;

    public VirtualizationsResponseDTO() {    }

    public VirtualizationsResponseDTO(Long id, HostType hostType, VirtualizationType type, String version, Set<InterfaceDTO> interfaces, String cpuModel, Integer cpuCores, Integer ramSize, StorageUnit ramSizeUnit, Integer storageSize, StorageUnit storageSizeUnit, StorageType storageType, LocalDateTime createdAt, LocalDateTime updatedAt, BareMetalServerResponseDTO server, Set<VirtualMachineResponseDTO> vm, Set<UserResponseDTO> user) {
        this.id = id;
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
        this.storageType = storageType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.server = server;
        this.vm = vm;
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

    public VirtualizationType getType() {
        return type;
    }

    public void setType(VirtualizationType type) {
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

    public StorageUnit getRamSizeUnit() {
        return ramSizeUnit;
    }

    public void setRamSizeUnit(StorageUnit ramSizeUnit) {
        this.ramSizeUnit = ramSizeUnit;
    }

    public Integer getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(Integer storageSize) {
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

    public BareMetalServerResponseDTO getServer() {
        return server;
    }

    public void setServer(BareMetalServerResponseDTO server) {
        this.server = server;
    }

    public Set<VirtualMachineResponseDTO> getVm() {
        return vm;
    }

    public void setVm(Set<VirtualMachineResponseDTO> vm) {
        this.vm = vm;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }
}
