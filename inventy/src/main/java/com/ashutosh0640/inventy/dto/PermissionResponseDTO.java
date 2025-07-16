package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResponseDTO {

    private Long id;
    private String name; // e.g., "READ_USER", "WRITE_PROJECT"
    private String description;
    private ResourceType resourceType; // USER, PROJECT, SERVER, VM
    private Set<RoleResponseDTO> role;

}
