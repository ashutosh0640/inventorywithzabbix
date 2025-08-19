package com.ashutosh0640.inventy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "racks")
public class Racks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "total_slot")
    private Short totalSlot;  // default 42

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @OneToMany(mappedBy = "rack", cascade = CascadeType.ALL)
    private Set<BareMetalServers> servers;

    @OneToMany(mappedBy = "rack", cascade = CascadeType.ALL)
    private Set<NetworkDevices> networkDevices;

    @OneToMany(mappedBy = "rack", cascade = CascadeType.ALL)
    private Set<RackSlots> slots = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name="rack_user",
            joinColumns=@JoinColumn(name="rack_id"),
            inverseJoinColumns=@JoinColumn(name="user_id")
    )
    private Set<User> users;


    public Racks() { }

    public Racks(Long id, String name, Short totalSlot, LocalDateTime createdAt, LocalDateTime updatedAt, Location location, Set<BareMetalServers> servers, Set<NetworkDevices> networkDevices, Set<RackSlots> slots, Set<User> users) {
        this.id = id;
        this.name = name;
        this.totalSlot = totalSlot;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.location = location;
        this.servers = servers;
        this.networkDevices = networkDevices;
        this.slots = slots;
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

    public Short getTotalSlot() {
        return totalSlot;
    }

    public void setTotalSlot(Short totalSlot) {
        this.totalSlot = totalSlot;
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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Set<BareMetalServers> getServers() {
        return servers;
    }

    public void setServers(Set<BareMetalServers> servers) {
        this.servers = servers;
    }

    public Set<NetworkDevices> getNetworkDevices() {
        return networkDevices;
    }

    public void setNetworkDevices(Set<NetworkDevices> networkDevices) {
        this.networkDevices = networkDevices;
    }

    public Set<RackSlots> getSlots() {
        return slots;
    }

    public void setSlots(Set<RackSlots> slots) {
        this.slots = slots;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
