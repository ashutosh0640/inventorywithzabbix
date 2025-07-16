package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.entity.Interfaces;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VirtualMachineRequestDTO {

    @NotBlank(message = "VM name is required")
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

}
