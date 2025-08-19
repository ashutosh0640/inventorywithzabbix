package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.ManagementType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
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

    public BareMetalServers() {}

    public BareMetalServers(String manufacturer, String modelName, String serialNumber, ManagementType management, Short rackSlotNumber, Set<Virtualizations> virtualizations, Racks rack) {
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.serialNumber = serialNumber;
        this.management = management;
        this.rackSlotNumber = rackSlotNumber;
        this.virtualizations = virtualizations;
        this.rack = rack;
    }

    public BareMetalServers(Long id, HostType hostType, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Interfaces> interfaces, Set<User> users, String manufacturer, String modelName, String serialNumber, ManagementType management, Short rackSlotNumber, Set<Virtualizations> virtualizations, Racks rack) {
        super(id, hostType, createdAt, updatedAt, interfaces, users);
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.serialNumber = serialNumber;
        this.management = management;
        this.rackSlotNumber = rackSlotNumber;
        this.virtualizations = virtualizations;
        this.rack = rack;
    }



    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public ManagementType getManagement() {
        return management;
    }

    public void setManagement(ManagementType management) {
        this.management = management;
    }

    public Short getRackSlotNumber() {
        return rackSlotNumber;
    }

    public void setRackSlotNumber(Short rackSlotNumber) {
        this.rackSlotNumber = rackSlotNumber;
    }

    public Set<Virtualizations> getVirtualizations() {
        return virtualizations;
    }

    public void setVirtualizations(Set<Virtualizations> virtualizations) {
        this.virtualizations = virtualizations;
    }

    public Racks getRack() {
        return rack;
    }

    public void setRack(Racks rack) {
        this.rack = rack;
    }
}
