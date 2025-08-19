package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.InterfaceDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.dto.VirtualMachineRequestDTO;
import com.ashutosh0640.inventy.dto.VirtualMachineResponseDTO;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.entity.VirtualMachines;
import com.ashutosh0640.inventy.entity.Virtualizations;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.OsType;
import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;

import java.util.Set;
import java.util.stream.Collectors;

public class VirtualMachineMapper {

    public static VirtualMachines toEntity(VirtualMachineRequestDTO dto, Virtualizations virtualizations, Set<User> users) {
        VirtualMachines virtualMachine = new VirtualMachines();
        virtualMachine.setHostName(dto.getHostName());
        virtualMachine.setHostType(HostType.valueOf(dto.getHostType().toUpperCase()));
        virtualMachine.setOs(OsType.valueOf(dto.getOs().toUpperCase()));
        virtualMachine.setOsVersion(dto.getOsVersion());
        virtualMachine.setCpuModel(dto.getCpuModel());
        virtualMachine.setCpuCores(dto.getCpuCores());
        virtualMachine.setRamSize(dto.getRamSize());
        virtualMachine.setRamSizeUnit(StorageUnit.valueOf(dto.getRamSizeUnit().toUpperCase()));
        virtualMachine.setStorageSize(dto.getStorageSize());
        virtualMachine.setStorageSizeUnit(StorageUnit.valueOf(dto.getStorageSizeUnit().toUpperCase()));
        virtualMachine.setStorageType(StorageType.valueOf(dto.getStorageType()));
        virtualMachine.setVirtualizations(virtualizations);
        virtualMachine.setUsers(users);

        return virtualMachine;
    }

    public static VirtualMachineResponseDTO toDTO(VirtualMachines entity) {
        VirtualMachineResponseDTO vmDto = new VirtualMachineResponseDTO();

        vmDto.setId(entity.getId());
        vmDto.setHostType(entity.getHostType());
        vmDto.setOs(entity.getOs());
        vmDto.setOsVersion(entity.getOsVersion());
        vmDto.setCpuModel(entity.getCpuModel());
        vmDto.setCpuCores(entity.getCpuCores());
        vmDto.setRamSize(entity.getRamSize());
        vmDto.setRamSizeUnit(entity.getRamSizeUnit());
        vmDto.setStorageSize(entity.getStorageSize());
        vmDto.setStorageSizeUnit(entity.getStorageSizeUnit());
        vmDto.setStorageType(entity.getStorageType());
        vmDto.setCreatedAt(entity.getCreatedAt());
        vmDto.setUpdatedAt(entity.getUpdatedAt());

        return vmDto;
    }


    public static VirtualMachineResponseDTO toDTO(VirtualMachines entity, Set<Interfaces> interf, Virtualizations vp, Set<User> user) {
        VirtualMachineResponseDTO vmDto = toDTO(entity);

        if (vp != null) {
            vmDto.setVp(VirtualizationsMapper.toDTO(vp));
        }

        if (interf != null && !interf.isEmpty()) {
            Set<InterfaceDTO> interfDto = interf.stream()
                    .map(InterfaceMapper::toDTO)
                    .collect(Collectors.toSet());
            vmDto.setInterfaces(interfDto);
        }


        if (user != null && !user.isEmpty()) {
            Set<UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            vmDto.setUser(userDto);
        }
        return vmDto;
    }
}
