package com.ashutosh0640.inventy.dto;

import java.math.BigDecimal;

public class LocationDetailsDTO {

    private String location;
    private Long rackCount;
    private Long baremetalCount;
    private Long networkDeviceCount;
    private Long slotsCount;
    private BigDecimal rackOccupiedPer;

    public LocationDetailsDTO() { }

    public LocationDetailsDTO(String location, Long rackCount, Long baremetalCount, Long networkDeviceCount, Long slotsCount, BigDecimal rackOccupiedPer) {
        this.location = location;
        this.rackCount = rackCount;
        this.baremetalCount = baremetalCount;
        this.networkDeviceCount = networkDeviceCount;
        this.slotsCount = slotsCount;
        this.rackOccupiedPer = rackOccupiedPer;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getRackCount() {
        return rackCount;
    }

    public void setRackCount(Long rackCount) {
        this.rackCount = rackCount;
    }

    public Long getBaremetalCount() {
        return baremetalCount;
    }

    public void setBaremetalCount(Long baremetalCount) {
        this.baremetalCount = baremetalCount;
    }

    public Long getNetworkDeviceCount() {
        return networkDeviceCount;
    }

    public void setNetworkDeviceCount(Long networkDeviceCount) {
        this.networkDeviceCount = networkDeviceCount;
    }

    public Long getSlotsCount() {
        return slotsCount;
    }

    public void setSlotsCount(Long slotsCount) {
        this.slotsCount = slotsCount;
    }

    public BigDecimal getRackOccupiedPer() {
        return rackOccupiedPer;
    }

    public void setRackOccupiedPer(BigDecimal rackOccupiedPer) {
        this.rackOccupiedPer = rackOccupiedPer;
    }
}
