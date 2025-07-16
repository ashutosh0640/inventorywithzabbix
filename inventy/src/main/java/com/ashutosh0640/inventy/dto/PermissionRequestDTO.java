package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.enums.ResourceType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionRequestDTO {

    @NotBlank(message = "Name is required.")
    private String name; // e.g., "READ_USER", "WRITE_PROJECT"

    private String description;

    @NotBlank(message = "Resource is required.")
    private String resourceType; // USER, PROJECT, SERVER, VM

    private Set<Integer> roleIds;
}
