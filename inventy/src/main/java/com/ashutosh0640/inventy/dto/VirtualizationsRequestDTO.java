package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.VirtualizationType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VirtualizationsRequestDTO {


    private String name;

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


}
