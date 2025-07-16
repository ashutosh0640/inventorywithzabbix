package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.SlotStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
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

}



