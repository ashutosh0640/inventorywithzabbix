package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.PermissionRequestDTO;
import com.ashutosh0640.inventy.dto.PermissionResponseDTO;
import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.entity.*;
import com.ashutosh0640.inventy.enums.PermissionType;
import com.ashutosh0640.inventy.enums.ResourceType;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PermissionMapper {

    public static Permissions toEntity(PermissionRequestDTO dto, Set<Role> roles) {
        Permissions p = new Permissions();
        p.setName(PermissionType.valueOf(dto.getName().toUpperCase()));
        p.setDescription(dto.getDescription());
        p.setResourceType(ResourceType.valueOf(dto.getResourceType().toUpperCase()));

        if (roles != null && !roles.isEmpty()) {
            p.setRoles(roles);
        }
        return p;
    }

    public static PermissionResponseDTO toDTO(Permissions permission) {
        PermissionResponseDTO dto = new PermissionResponseDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getName().toString());
        dto.setDescription(permission.getDescription());
        dto.setResourceType(permission.getResourceType());
        return dto;
    }


    public static PermissionResponseDTO toDTO(Permissions permission, Set<Role> role) {
        PermissionResponseDTO dto = toDTO(permission);
        if (role != null && !role.isEmpty()) {
            Set<RoleResponseDTO> roleDto = role.stream()
                    .map(RoleMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setRole(roleDto);
        }
        return dto;
    }
}
