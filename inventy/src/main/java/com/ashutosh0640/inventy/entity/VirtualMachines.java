package com.ashutosh0640.inventy.entity;


import com.ashutosh0640.inventy.enums.OsType;
import com.ashutosh0640.inventy.enums.StorageType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "virtual_machines")
public class VirtualMachines extends Hosts {

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OsType os;

    @Column(nullable = false)
    private String osVersion;

    @Column(nullable = false)
    private String cpuModel;

    @Column(nullable = false)
    private int cpuCores;

    @Column(nullable = false)
    private int ramSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageUnit ramSizeUnit;

    @Column(nullable = false)
    private int storageSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageUnit storageSizeUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StorageType storageType;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "v_id", nullable = false)
    private Virtualizations virtualizations;


}
