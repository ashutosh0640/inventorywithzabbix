package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.Location;
import com.ashutosh0640.inventy.entity.Project;
import com.ashutosh0640.inventy.entity.Racks;
import com.ashutosh0640.inventy.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class LocationMapper {

    // Convert DTO to Entity (For Create/Update)
    public static Location toEntity(LocationRequestDTO dto, Set<User> assignedUser) {
        Location location = new Location();
        location.setName(dto.getName());
        if (assignedUser != null ) {
            location.setUsers(assignedUser);
        }
        return location;
    }

    // Convert Entity to Response DTO (For Sending Data)
    public static LocationResponseDTO toDTO(Location location) {
        LocationResponseDTO dto = new LocationResponseDTO();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setCreatedAt(location.getCreatedAt());
        dto.setUpdatedAt(location.getUpdatedAt());
        return dto;
    }



    // Convert Entity to Response DTO (For Sending Data)
    public static LocationResponseDTO toDTO(Location location, Set<Racks> rack, Set<Project> project, Set<User> user) {
        LocationResponseDTO dto = toDTO(location);

        // Map racks
        if (rack != null && !rack.isEmpty()) {
            Set<RackResponseDTO> rackDto = rack.stream()
                    .map(RackMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setRack(rackDto);
        }

        if ( project != null && !project.isEmpty()) {
            Set<ProjectResponseDTO> projectDto = project.stream()
                    .map(ProjectMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setProject(projectDto);
        }

        // Map users
        if (user != null && !user.isEmpty()) {
            Set< UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setUser(userDto);
        }
        return dto;
    }

}