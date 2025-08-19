package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.RoleType;

import java.util.Set;

public class RoleResponseDTO {

    private int id;
    private RoleType roleType;
    private Set<UserResponseDTO> user;
    private Set<PermissionResponseDTO> permissions;

    public RoleResponseDTO() {    }

    public RoleResponseDTO(int id, RoleType roleType, Set<UserResponseDTO> user, Set<PermissionResponseDTO> permissions) {
        this.id = id;
        this.roleType = roleType;
        this.user = user;
        this.permissions = permissions;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }

    public Set<UserResponseDTO> getUser() {
        return user;
    }

    public void setUser(Set<UserResponseDTO> user) {
        this.user = user;
    }

    public Set<PermissionResponseDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<PermissionResponseDTO> permissions) {
        this.permissions = permissions;
    }
}
