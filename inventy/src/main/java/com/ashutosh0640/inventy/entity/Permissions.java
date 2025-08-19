package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.PermissionType;
import com.ashutosh0640.inventy.enums.ResourceType;
import jakarta.persistence.*;

import java.util.Set;

@Entity
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


    public Permissions() { }

    public Permissions(Long id, PermissionType name, String description, ResourceType resourceType, Set<Role> roles) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.resourceType = resourceType;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PermissionType getName() {
        return name;
    }

    public void setName(PermissionType name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
