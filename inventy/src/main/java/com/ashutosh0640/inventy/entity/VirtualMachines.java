package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.OsType;
import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "virtual_machines")
public class VirtualMachines extends Hosts {

    @Column(name = "host_name", nullable = false, unique = true)
    private String hostName;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OsType os;

    @Column(nullable = false)
    private String osVersion;

    @Column(nullable = false)
    private String cpuModel;

    @Column(nullable = false)
    private int cpuCores;

    @Column(nullable = false)
    private int ramSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageUnit ramSizeUnit;

    @Column(nullable = false)
    private int storageSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageUnit storageSizeUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageType storageType;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "v_id", nullable = false)
    private Virtualizations virtualizations;

    public VirtualMachines() {    }

    public VirtualMachines( String hostName, OsType os, String osVersion, String cpuModel, int cpuCores, int ramSize, StorageUnit ramSizeUnit, int storageSize, StorageUnit storageSizeUnit, StorageType storageType, String remarks, Virtualizations virtualizations) {
        this.hostName = hostName;
        this.os = os;
        this.osVersion = osVersion;
        this.cpuModel = cpuModel;
        this.cpuCores = cpuCores;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storageType = storageType;
        this.remarks = remarks;
        this.virtualizations = virtualizations;
    }

    public VirtualMachines(Long id, String hostName, HostType hostType, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Interfaces> interfaces, Set<User> users, OsType os, String osVersion, String cpuModel, int cpuCores, int ramSize, StorageUnit ramSizeUnit, int storageSize, StorageUnit storageSizeUnit, StorageType storageType, String remarks, Virtualizations virtualizations) {
        super(id, hostType, createdAt, updatedAt, interfaces, users);
        this.hostName = hostName;
        this.os = os;
        this.osVersion = osVersion;
        this.cpuModel = cpuModel;
        this.cpuCores = cpuCores;
        this.ramSize = ramSize;
        this.ramSizeUnit = ramSizeUnit;
        this.storageSize = storageSize;
        this.storageSizeUnit = storageSizeUnit;
        this.storageType = storageType;
        this.remarks = remarks;
        this.virtualizations = virtualizations;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Virtualizations getVirtualizations() {
        return virtualizations;
    }

    public void setVirtualizations(Virtualizations virtualizations) {
        this.virtualizations = virtualizations;
    }
}
