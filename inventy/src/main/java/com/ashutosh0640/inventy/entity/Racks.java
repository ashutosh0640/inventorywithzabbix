package com.ashutosh0640.inventy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private Set<RackSlots> slots;

    @ManyToMany
    @JoinTable(
            name="rack_user",
            joinColumns=@JoinColumn(name="rack_id"),
            inverseJoinColumns=@JoinColumn(name="user_id")
    )
    private Set<User> users;


}
