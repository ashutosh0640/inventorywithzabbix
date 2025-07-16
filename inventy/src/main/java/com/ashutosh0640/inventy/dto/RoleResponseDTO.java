package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponseDTO {

    private int id;
    private RoleType roleType;
    private Set<UserResponseDTO> user;
    private Set<PermissionResponseDTO> permissions;
}
