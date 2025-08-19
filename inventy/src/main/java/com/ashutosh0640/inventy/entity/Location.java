package com.ashutosh0640.inventy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    private Set<Racks> racks;

    @ManyToMany(mappedBy = "locations")
    private Set<Project> projects;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name="location_user",
            joinColumns=@JoinColumn(name="location_id"),
            inverseJoinColumns=@JoinColumn(name="user_id")
    )
    private Set<User> users;

    public Location() { }

    public Location(Long id, String name, Set<Racks> racks, Set<Project> projects, LocalDateTime createdAt, LocalDateTime updatedAt, Set<User> users) {
        this.id = id;
        this.name = name;
        this.racks = racks;
        this.projects = projects;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.users = users;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Racks> getRacks() {
        return racks;
    }

    public void setRacks(Set<Racks> racks) {
        this.racks = racks;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}

