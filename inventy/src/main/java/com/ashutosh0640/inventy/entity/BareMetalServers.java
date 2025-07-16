package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.ManagementType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "baremetals")
public class BareMetalServers extends Hosts {

    @Column(nullable = false)
    private String manufacturer;

    @Column(nullable = false)
    private String modelName;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    private ManagementType management;

    @Column(name = "rack_slot_no")
    private Short rackSlotNumber;

    @OneToMany(mappedBy = "bareMetalServer", cascade = CascadeType.ALL)
    private Set<Virtualizations> virtualizations;

    @ManyToOne
    @JoinColumn(name = "rack_id", nullable = false)
    private Racks rack;

}
