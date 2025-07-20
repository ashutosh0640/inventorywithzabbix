package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class RackMapper {

    // Convert Request DTO to Entity (For Create/Update)
    public static Racks toEntity(RackRequestDTO dto, Location location, Set<User> users) {
        Racks rack = new Racks();
        rack.setName(dto.getName());
        if (dto.getTotalSlot() != null) {
            rack.setTotalSlot(dto.getTotalSlot());
        } else {
            rack.setTotalSlot((short)42);
        }

        rack.setLocation(location);

        if (users == null) {
            if (location != null) {
                rack.setUsers(location.getUsers());
            } else {
                rack.setUsers(new HashSet<>());
            }
        } else {
            rack.setUsers(users);
        }
        return rack;
    }

    // Convert Entity to Response DTO (For Sending Data)
    public static RackResponseDTO toDTO(Racks rack) {

        RackResponseDTO dto = new RackResponseDTO();
        dto.setId(rack.getId());
        dto.setName(rack.getName());
        dto.setTotalSlot(rack.getTotalSlot());
        dto.setLocation(LocationMapper.toDTO(rack.getLocation()));
        dto.setCreatedAt(rack.getCreatedAt());
        dto.setUpdatedAt(rack.getUpdatedAt());
        return dto;
    }



    public static RackResponseDTO toDTO(Racks rack, Long occupied, Set<BareMetalServers> server, Set<NetworkDevices> devices, Set<User> user) {
        RackResponseDTO dto = toDTO(rack);

        dto.setOccupiedSlot(occupied);

        if (server != null && !server.isEmpty()) {
            Set<BareMetalServerResponseDTO> serversDto = server.stream()
                    .map(BareMetalMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setServer(serversDto);
        } else {
            dto.setServer(new HashSet<>());
        }

        if (devices != null && !devices.isEmpty()) {
            Set<NetworkDeviceResponseDTO> networkDto = devices.stream()
                    .map(NetworkDeviceMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setNetworkDevices(networkDto);
        } else {
            dto.setNetworkDevices(new HashSet<>());
        }

        if (user != null &&  !user.isEmpty()) {
            Set<UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setUser(userDto);
        } else {
            dto.setUser(new HashSet<>());
        }

        return dto;
    }

}
