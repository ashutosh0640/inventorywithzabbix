package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Set;

public class VirtualMachineRequestDTO {

    @NotBlank(message = "Host name type is required")
    private String hostName;
    @NotBlank(message = "Host type is required")
    private String hostType;
    @NotBlank(message = "Operating System is required")
    private String os;
    @NotBlank(message = "Version is required")
    private String osVersion;
    @NotBlank(message = "Interface is required")
    private List<InterfaceDTO> interfaces;
    @NotNull(message = "CPU model is required")
    private String cpuModel;
    @NotNull(message = "CPU cores are required")
    private int cpuCores;
    @NotNull(message = "RAM size is required")
    private int ramSize;
    @NotBlank(message = "RAM unit is required")
    private String ramSizeUnit; // MB, GB
    @NotNull(message = "Storage size is required")
    private int storageSize;
    @NotBlank(message = "Storage unit is required")
    private String storageSizeUnit; // GB, TB
    @NotBlank(message = "Storage type is required.")
    private String storageType;
    @NotNull(message = "Virtual Platform is required.")
    private Long vpId;
    private Set<Long> usersId;
    private List<String> groupId;
    private List<String> templateId;

    public VirtualMachineRequestDTO() {    }

    public VirtualMachineRequestDTO( String hostName, String hostType, String os, String osVersion, List<InterfaceDTO> interfaces, String cpuModel, int cpuCores, int ramSize, String ramSizeUnit, int storageSize, String storageSizeUnit, String storageType, Long vpId, Set<Long> usersId, List<String> groupId, List<String> templateId) {
        this.hostName = hostName;
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
        this.vpId = vpId;
        this.usersId = usersId;
        this.groupId = groupId;
        this.templateId = templateId;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getHostType() {
        return hostType;
    }

    public void setHostType(String hostType) {
        this.hostType = hostType;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public List<InterfaceDTO> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(List<InterfaceDTO> interfaces) {
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

    public String getRamSizeUnit() {
        return ramSizeUnit;
    }

    public void setRamSizeUnit(String ramSizeUnit) {
        this.ramSizeUnit = ramSizeUnit;
    }

    public int getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(int storageSize) {
        this.storageSize = storageSize;
    }

    public String getStorageSizeUnit() {
        return storageSizeUnit;
    }

    public void setStorageSizeUnit(String storageSizeUnit) {
        this.storageSizeUnit = storageSizeUnit;
    }

    public String getStorageType() {
        return storageType;
    }

    public void setStorageType(String storageType) {
        this.storageType = storageType;
    }

    public Long getVpId() {
        return vpId;
    }

    public void setVpId(Long vpId) {
        this.vpId = vpId;
    }

    public Set<Long> getUsersId() {
        return usersId;
    }

    public void setUsersId(Set<Long> usersId) {
        this.usersId = usersId;
    }

    public List<String> getGroupId() {
        return groupId;
    }

    public void setGroupId(List<String> groupId) {
        this.groupId = groupId;
    }

    public List<String> getTemplateId() {
        return templateId;
    }

    public void setTemplateId(List<String> templateId) {
        this.templateId = templateId;
    }
}
