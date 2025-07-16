package com.ashutosh0640.inventy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NetworkDevices extends Hosts {

    private String manufacturer;

    private String model;

    @Column(name = "os_version")
    private String osVersion;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "number_of_port")
    private Short numberOfPort;

    @Column(name = "rack_slot_no")
    private Short rackSlotNumber;

    @ManyToOne
    @JoinColumn(name = "rack_id", nullable = false)
    private Racks rack;


}
