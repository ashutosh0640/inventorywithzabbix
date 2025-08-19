package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import com.ashutosh0640.inventy.enums.VirtualizationType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;


@Entity
@Table(name = "virtual_platforms")
public class Virtualizations extends Hosts {

    @Enumerated(EnumType.STRING)
    private VirtualizationType type;

    @Column(name = "version", nullable = false)
    private String version;

    @Column(name = "cup_model", nullable = false)
    private String cpuModel;

    @Column(name = "cpu_core", nullable = false)
    private Integer cpuCore;

    @Column(name = "ram_size", nullable = false)
    private Integer ramSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "ram_size_unit", nullable = false)
    private StorageUnit ramSizeUnit;

    @Column(name = "storage_unit", nullable = false)
    private Integer storageSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_size_unit", nullable = false)
    private StorageUnit storageSizeUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type", nullable = false)
    private StorageType storageType = StorageType.HDD;

    @ManyToOne
    @JoinColumn(name = "baremetal_id", nullable = false)
    private BareMetalServers bareMetalServer;

    @OneToMany(mappedBy = "virtualizations", cascade = CascadeType.ALL)
    private Set<VirtualMachines> virtualMachines;

    public Virtualizations() {    }

    public Virtualizations(VirtualizationType type, String version, String cpuModel, Integer cpuCore, Integer ramSize, StorageUnit ramSizeUnit, Integer storageSize, StorageUnit storageSizeUnit, StorageType storageType, BareMetalServers bareMetalServer, Set<VirtualMachines> virtualMachines) {
        this.type = type;
        this.version = version;
        this.cpuModel = cpuModel;
        this.cpuCore = cpuCore;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storageType = storageType;
        this.bareMetalServer = bareMetalServer;
        this.virtualMachines = virtualMachines;
    }

    public Virtualizations(Long id, HostType hostType, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Interfaces> interfaces, Set<User> users, VirtualizationType type, String version, String cpuModel, Integer cpuCore, Integer ramSize, StorageUnit ramSizeUnit, Integer storageSize, StorageUnit storageSizeUnit, StorageType storageType, BareMetalServers bareMetalServer, Set<VirtualMachines> virtualMachines) {
        super(id, hostType, createdAt, updatedAt, interfaces, users);
        this.type = type;
        this.version = version;
        this.cpuModel = cpuModel;
        this.cpuCore = cpuCore;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storageType = storageType;
        this.bareMetalServer = bareMetalServer;
        this.virtualMachines = virtualMachines;
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

    public String getCpuModel() {
        return cpuModel;
    }

    public void setCpuModel(String cpuModel) {
        this.cpuModel = cpuModel;
    }

    public Integer getCpuCore() {
        return cpuCore;
    }

    public void setCpuCore(Integer cpuCore) {
        this.cpuCore = cpuCore;
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

    public BareMetalServers getBareMetalServer() {
        return bareMetalServer;
    }

    public void setBareMetalServer(BareMetalServers bareMetalServer) {
        this.bareMetalServer = bareMetalServer;
    }

    public Set<VirtualMachines> getVirtualMachines() {
        return virtualMachines;
    }

    public void setVirtualMachines(Set<VirtualMachines> virtualMachines) {
        this.virtualMachines = virtualMachines;
    }
}
