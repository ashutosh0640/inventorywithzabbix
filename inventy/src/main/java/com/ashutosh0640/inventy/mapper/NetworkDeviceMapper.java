package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.InterfaceDTO;
import com.ashutosh0640.inventy.dto.NetworkDeviceRequestDTO;
import com.ashutosh0640.inventy.dto.NetworkDeviceResponseDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.NetworkDevices;
import com.ashutosh0640.inventy.entity.Racks;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.HostType;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class NetworkDeviceMapper {

    public static NetworkDevices toEntity(NetworkDeviceRequestDTO dto, Racks rack, Set<User> users) {
        NetworkDevices entity = new NetworkDevices();
        entity.setHostType(HostType.valueOf(dto.getType().toUpperCase()));
        entity.setManufacturer(dto.getManufacturer());
        entity.setModel(dto.getModel());
        entity.setOsVersion(dto.getOsVersion());
        entity.setSerialNumber(dto.getSerialNumber());
        if (dto.getNumberOfPort() != null) {
            entity.setNumberOfPort(dto.getNumberOfPort());
        }

        Set<Interfaces> interfaces = dto.getInterfaces().stream()
                .map(i->{
                    return InterfaceMapper.toEntity(i, entity);
                }).collect(Collectors.toSet());

        entity.setInterfaces(interfaces);
        entity.setRack(rack);
        entity.setRackSlotNumber(dto.getRackSlotNumber());
        entity.setUsers(users);

        return entity;
    }

    public static NetworkDeviceResponseDTO toDTO(NetworkDevices entity) {
        NetworkDeviceResponseDTO dto = new NetworkDeviceResponseDTO();
        dto.setId(entity.getId());
        dto.setType(entity.getHostType());
        dto.setManufacturer(entity.getManufacturer());
        dto.setModel(entity.getModel());
        dto.setOsVersion(entity.getOsVersion());
        dto.setSerialNumber(entity.getSerialNumber());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getNumberOfPort() != null) {
            dto.setNumberOfPort(entity.getNumberOfPort());
        }
        dto.setRack(RackMapper.toDTO(entity.getRack()));
        dto.setRackSlotNumber(entity.getRackSlotNumber());

        return dto;
    }


    public static NetworkDeviceResponseDTO toDTO(NetworkDevices entity, Set<Interfaces> interf, Set<User> users) {
        NetworkDeviceResponseDTO dto = toDTO(entity);

        if ( interf != null ) {
            Set<InterfaceDTO> interfaceDTOS = interf.stream()
                    .map(InterfaceMapper::toDTO).collect(Collectors.toSet());
            dto.setInterfaces(interfaceDTOS);
        } else {
            dto.setInterfaces(new HashSet<>());
        }

        if (users != null) {
            Set<UserResponseDTO> userDTOS = users.stream().map(UserMapper::toDTO).collect(Collectors.toSet());
            dto.setUsers(userDTOS);
        } else {
            dto.setUsers(new HashSet<>());
        }
        return dto;
    }

}
