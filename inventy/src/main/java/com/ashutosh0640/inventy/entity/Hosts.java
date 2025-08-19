package com.ashutosh0640.inventy.entity;
import com.ashutosh0640.inventy.enums.HostType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Hosts {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "host_type")
    @Enumerated(EnumType.STRING)
    private HostType hostType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Interfaces> interfaces = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "host_user",
            joinColumns = @JoinColumn(name = "host_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users;

    public Hosts() {}

    public Hosts(Long id, HostType hostType, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Interfaces> interfaces, Set<User> users) {
        this.id = id;
        this.hostType = hostType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.interfaces = interfaces;
        this.users = users;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HostType getHostType() {
        return hostType;
    }

    public void setHostType(HostType hostType) {
        this.hostType = hostType;
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

    public Set<Interfaces> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(Set<Interfaces> interfaces) {
        this.interfaces = interfaces;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

}
