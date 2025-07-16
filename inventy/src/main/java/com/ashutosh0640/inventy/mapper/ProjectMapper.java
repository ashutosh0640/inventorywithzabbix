package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.LocationResponseDTO;
import com.ashutosh0640.inventy.dto.ProjectRequestDTO;
import com.ashutosh0640.inventy.dto.ProjectResponseDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.entity.Location;
import com.ashutosh0640.inventy.entity.Project;
import com.ashutosh0640.inventy.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class ProjectMapper {

    public static Project toEntity(ProjectRequestDTO dto, Set<Location> locations, Set<User> users) {
        Project p = new Project();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        if (locations != null && !locations.isEmpty()) {
            p.setLocations(locations);
        }
        if (users != null && !users.isEmpty()) {
            p.setUsers(users);
        }
        return p;
    }

    public static ProjectResponseDTO toDTO(Project project) {

        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        return dto;
    }


    public static ProjectResponseDTO toDTO(Project project, Set<Location> locations, Set<User> users) {

        ProjectResponseDTO dto = toDTO(project);

        if (locations != null && !locations.isEmpty()) {
            Set<LocationResponseDTO> locationDto = locations.stream()
                    .map(LocationMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setLocation(locationDto);
        }

        if (users != null && !users.isEmpty()) {
            Set<UserResponseDTO> userDto = users.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setUser(userDto);
        }
        return dto;
    }
}
