package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.enums.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

}
