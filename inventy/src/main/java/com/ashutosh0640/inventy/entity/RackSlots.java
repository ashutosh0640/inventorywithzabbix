package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.SlotStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "rack_slots")
public class RackSlots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Short slotNumber;

    @Enumerated(EnumType.STRING)
    private SlotStatus status; // EMPTY / OCCUPIED

    @ManyToOne
    @JoinColumn(name = "rack_id")
    private Racks rack;

    @OneToOne
    @JoinColumn(name = "host_id")
    private Hosts hosts;

    public RackSlots() {
        this.status = SlotStatus.EMPTY;
    }

    public RackSlots(Long id, Short slotNumber, SlotStatus status, Racks rack, Hosts hosts) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.status = status;
        this.rack = rack;
        this.hosts = hosts;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(Short slotNumber) {
        this.slotNumber = slotNumber;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }

    public Racks getRack() {
        return rack;
    }

    public void setRack(Racks rack) {
        this.rack = rack;
    }

    public Hosts getHosts() {
        return hosts;
    }

    public void setHosts(Hosts hosts) {
        this.hosts = hosts;
    }
}



