package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.PermissionType;
import com.ashutosh0640.inventy.enums.ResourceType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Permissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private PermissionType name; // e.g., "READ_USER", "WRITE_PROJECT"

    private String description;

    @Enumerated(EnumType.STRING)
    private ResourceType resourceType; // USER, PROJECT, SERVER, VM

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;

}
