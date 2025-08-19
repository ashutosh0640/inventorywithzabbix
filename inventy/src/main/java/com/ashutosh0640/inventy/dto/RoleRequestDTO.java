package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public class RoleRequestDTO {

    @NotBlank(message = "Role name is required.")
    private String roleName;

    private Set<Long> permissionId;

    public RoleRequestDTO() {    }

    public RoleRequestDTO(String roleName, Set<Long> permissionId) {
        this.roleName = roleName;
        this.permissionId = permissionId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Set<Long> getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Set<Long> permissionId) {
        this.permissionId = permissionId;
    }
}
