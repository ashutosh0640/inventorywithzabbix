package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.PermissionResponseDTO;
import com.ashutosh0640.inventy.dto.RoleRequestDTO;
import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.entity.Permissions;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.RoleType;

import java.util.Set;
import java.util.stream.Collectors;

public class RoleMapper {


    public static Role toEntity(RoleRequestDTO dto ) {
        Role role = new Role();
        RoleType roleType = RoleType.valueOf(dto.getRoleName().toUpperCase());
        role.setRoleName(roleType);
        return role;
    }

    public static Role toEntity(RoleRequestDTO dto, Set<Permissions> permissions ) {
        Role role = toEntity(dto);

        if (permissions != null) {
            role.setPermissions(permissions);
        }

        return role;
    }

    public static Role toEntity(RoleRequestDTO dto, Set<User> user, Set<Permissions> permissions ) {
        Role role = toEntity(dto);

        if (user != null) {
            role.setUsers(user);
        }

        if (dto.getPermissionId() != null) {
            role.setPermissions(permissions);
        }
        return role;
    }

    public static RoleResponseDTO toDTO(Role entity) {

        RoleResponseDTO roleResponseDTO = new RoleResponseDTO();
        roleResponseDTO.setId(entity.getId());
        roleResponseDTO.setRoleType(entity.getRoleName());
        return roleResponseDTO;
    }


    public static RoleResponseDTO toDTO(Role entity, Set<User> user,  Set<Permissions> permissions) {

        RoleResponseDTO roleResponseDTO = toDTO(entity);
        if (user != null && !user.isEmpty()) {
            Set<UserResponseDTO> userDto = user.stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet());
            roleResponseDTO.setUser(userDto);
        }
        if (permissions != null &&  !permissions.isEmpty()) {
            Set<PermissionResponseDTO> permissionDto = permissions.stream()
                    .map(PermissionMapper::toDTO)
                    .collect(Collectors.toSet());
            roleResponseDTO.setPermissions(permissionDto);
        }
        return roleResponseDTO;
    }
}
