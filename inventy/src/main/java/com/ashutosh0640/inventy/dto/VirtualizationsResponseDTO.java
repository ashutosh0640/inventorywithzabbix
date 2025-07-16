package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VirtualizationsResponseDTO {

    private Long id;
    private String name;
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

}
