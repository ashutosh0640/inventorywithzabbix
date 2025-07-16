package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import com.ashutosh0640.inventy.enums.VirtualizationType;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "virtual_platforms")
public class Virtualizations extends Hosts {

    @Enumerated(EnumType.STRING)
    private VirtualizationType type;

    @Column(name = "version", nullable = false)
    private String version;

    @Column(name = "cup_model", nullable = false)
    private String cpuModel;

    @Column(name = "cpu_core", nullable = false)
    private Integer cpuCore;

    @Column(name = "ram_size", nullable = false)
    private Integer ramSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "ram_size_unit", nullable = false)
    private StorageUnit ramSizeUnit;

    @Column(name = "storage_unit", nullable = false)
    private Integer storageSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_size_unit", nullable = false)
    private StorageUnit storageSizeUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type", nullable = false)
    private StorageType storageType = StorageType.HDD;

    @ManyToOne
    @JoinColumn(name = "baremetal_id", nullable = false)
    private BareMetalServers bareMetalServer;

    @OneToMany(mappedBy = "virtualizations", cascade = CascadeType.ALL)
    private Set<VirtualMachines> virtualMachines;

}
