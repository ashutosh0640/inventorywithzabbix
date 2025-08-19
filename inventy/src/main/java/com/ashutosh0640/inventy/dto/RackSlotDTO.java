package com.ashutosh0640.inventy.dto;


public class RackSlotDTO {

    private Long id;
    private Short slotNumber;
    private String status; // EMPTY / OCCUPIED

    public RackSlotDTO() {    }

    public RackSlotDTO(Long id, Short slotNumber, String status) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
