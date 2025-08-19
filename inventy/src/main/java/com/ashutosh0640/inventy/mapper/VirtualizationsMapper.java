package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.*;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import com.ashutosh0640.inventy.enums.VirtualizationType;

import java.util.Set;
import java.util.stream.Collectors;

public class VirtualizationsMapper {


    public static Virtualizations toEntity(VirtualizationsRequestDTO dto, BareMetalServers bareMetalServer, Set<User> users) {
        Virtualizations vp = new Virtualizations();
        vp.setHostType(HostType.valueOf(dto.getHostType()));
        vp.setType(VirtualizationType.valueOf(dto.getType()));
        vp.setVersion(dto.getVersion());
        vp.setCpuModel(dto.getCpuModel());
        vp.setCpuCore(dto.getCpuCores());
        vp.setRamSize(dto.getRamSize());
        vp.setRamSizeUnit(StorageUnit.valueOf(dto.getRamSizeUnit().toUpperCase()));
        vp.setStorageSize(dto.getStorageSize());
        vp.setStorageSizeUnit(StorageUnit.valueOf(dto.getStorageSizeUnit().toUpperCase()));
        vp.setStorageType(StorageType.valueOf(dto.getStoreageType()));
        vp.setBareMetalServer(bareMetalServer);
        vp.setUsers(users);
        return vp;
    }

    // Convert Entity to Response DTO (For Sending Data)
    public static VirtualizationsResponseDTO toDTO(Virtualizations platform) {
        VirtualizationsResponseDTO vpDto = new VirtualizationsResponseDTO();
        vpDto.setId(platform.getId());
        vpDto.setHostType(platform.getHostType());
        vpDto.setType(platform.getType());
        vpDto.setVersion(platform.getVersion());
        vpDto.setCpuModel(platform.getCpuModel());
        vpDto.setCpuCores(platform.getCpuCore());
        vpDto.setRamSize(platform.getRamSize());
        vpDto.setRamSizeUnit(platform.getRamSizeUnit());
        vpDto.setStorageSize(platform.getStorageSize());
        vpDto.setStorageSizeUnit(platform.getStorageSizeUnit());
        vpDto.setStorageType(platform.getStorageType());
        vpDto.setCreatedAt(platform.getCreatedAt());
        vpDto.setUpdatedAt(platform.getUpdatedAt());
        return  vpDto;
    }



    public static VirtualizationsResponseDTO toDTO(Virtualizations platform, Set<Interfaces> interf, BareMetalServers server, Set<VirtualMachines> vm, Set<User> user) {
        VirtualizationsResponseDTO vpDto = toDTO(platform);

        vpDto.setServer(BareMetalMapper.toDTO(server));

        if (vm != null && !vm.isEmpty()) {
            Set<VirtualMachineResponseDTO> vmDto = vm.stream()
                    .map(VirtualMachineMapper::toDTO)
                    .collect(Collectors.toSet());
            vpDto.setVm(vmDto);
        }

        if (interf != null && !interf.isEmpty()) {
            Set<InterfaceDTO> interfDto = interf.stream()
                    .map(InterfaceMapper::toDTO)
                    .collect(Collectors.toSet());
            vpDto.setInterfaces(interfDto);
        }

        if (user != null && !user.isEmpty()) {
            Set<UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            vpDto.setUser(userDto);
        }
        return vpDto;
    }
}
