package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.*;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.ManagementType;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class BareMetalMapper {

    public static BareMetalServers toEntity(BareMetalServerRequestDTO dto, Racks rack, Set<User> users) {
        BareMetalServers entity = new BareMetalServers();

        entity.setHostName(dto.getName());
        entity.setHostType(HostType.valueOf(dto.getType().toUpperCase()));
        entity.setManagement(ManagementType.valueOf(dto.getManagement().toUpperCase()));
        entity.setManufacturer(dto.getManufacturer());
        entity.setModelName(dto.getModelName());
        entity.setSerialNumber(dto.getSerialNumber());
        entity.setRack(rack);
        entity.setRackSlotNumber(dto.getRackSlotNumber());
        entity.setUsers(users != null ? users : new HashSet<>());
        return entity;
    }


    public static BareMetalServerResponseDTO toDTO(BareMetalServers server) {
        BareMetalServerResponseDTO dtos = new BareMetalServerResponseDTO();
        dtos.setId(server.getId());
        dtos.setName(server.getHostName());
        dtos.setType(server.getHostType());
        dtos.setManufacturer(server.getManufacturer());
        dtos.setModelName(server.getModelName());
        dtos.setSerialNumber(server.getSerialNumber());
        dtos.setManagement(server.getManagement());
        dtos.setRack(RackMapper.toDTO(server.getRack()));
        dtos.setRackSlotNumber(server.getRackSlotNumber());
        dtos.setCreatedAt(server.getCreatedAt());
        dtos.setUpdatedAt(server.getUpdatedAt());
        return dtos;
    }



    public static BareMetalServerResponseDTO toDTO(BareMetalServers server, Set<Interfaces> interfaces, Set<Virtualizations> vp, Set<User> user) {
        BareMetalServerResponseDTO b = toDTO(server);
        if (vp != null && !vp.isEmpty()) {
            Set<VirtualizationsResponseDTO> vpDto = vp.stream()
                    .map(VirtualizationsMapper::toDTO)
                    .collect(Collectors.toSet());
            b.setVp(vpDto);
        }
        if (interfaces != null && !interfaces.isEmpty()) {
            Set<InterfaceDTO> intfDto = interfaces.stream().map(InterfaceMapper::toDTO).collect(Collectors.toSet());
            b.setInterfaces(intfDto);
        }
        if (user != null && !user.isEmpty()) {
            Set<UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            b.setUser(userDto);
        }
        return b;
    }
}
