package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.HostType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
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

    public NetworkDevices() { }

    public NetworkDevices(String manufacturer, String model, String osVersion, String serialNumber, Short numberOfPort, Short rackSlotNumber, Racks rack) {
        this.manufacturer = manufacturer;
        this.model = model;
        this.osVersion = osVersion;
        this.serialNumber = serialNumber;
        this.numberOfPort = numberOfPort;
        this.rackSlotNumber = rackSlotNumber;
        this.rack = rack;
    }

    public NetworkDevices(Long id, HostType hostType, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Interfaces> interfaces, Set<User> users, String manufacturer, String model, String osVersion, String serialNumber, Short numberOfPort, Short rackSlotNumber, Racks rack) {
        super(id, hostType, createdAt, updatedAt, interfaces, users);
        this.manufacturer = manufacturer;
        this.model = model;
        this.osVersion = osVersion;
        this.serialNumber = serialNumber;
        this.numberOfPort = numberOfPort;
        this.rackSlotNumber = rackSlotNumber;
        this.rack = rack;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Short getNumberOfPort() {
        return numberOfPort;
    }

    public void setNumberOfPort(Short numberOfPort) {
        this.numberOfPort = numberOfPort;
    }

    public Short getRackSlotNumber() {
        return rackSlotNumber;
    }

    public void setRackSlotNumber(Short rackSlotNumber) {
        this.rackSlotNumber = rackSlotNumber;
    }

    public Racks getRack() {
        return rack;
    }

    public void setRack(Racks rack) {
        this.rack = rack;
    }
}
