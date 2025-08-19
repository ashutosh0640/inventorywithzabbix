package com.ashutosh0640.inventy.dto;


public class DashboardDTO {

    private Long locationCount;
    private Long projectCount;
    private Long rackCount;
    private Long baremetalCount;
    private Long baremetalOnlineCount;
    private Long vpCount;
    private Long vpOnlineCount;
    private Long vmCount;
    private Long vmOnlineCount;

    public DashboardDTO() { }

    public DashboardDTO(Long locationCount, Long projectCount, Long rackCount, Long baremetalCount, Long baremetalOnlineCount, Long vpCount, Long vpOnlineCount, Long vmCount, Long vmOnlineCount) {
        this.locationCount = locationCount;
        this.projectCount = projectCount;
        this.rackCount = rackCount;
        this.baremetalCount = baremetalCount;
        this.baremetalOnlineCount = baremetalOnlineCount;
        this.vpCount = vpCount;
        this.vpOnlineCount = vpOnlineCount;
        this.vmCount = vmCount;
        this.vmOnlineCount = vmOnlineCount;
    }

    public Long getLocationCount() {
        return locationCount;
    }

    public void setLocationCount(Long locationCount) {
        this.locationCount = locationCount;
    }

    public Long getProjectCount() {
        return projectCount;
    }

    public void setProjectCount(Long projectCount) {
        this.projectCount = projectCount;
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

    public Long getBaremetalOnlineCount() {
        return baremetalOnlineCount;
    }

    public void setBaremetalOnlineCount(Long baremetalOnlineCount) {
        this.baremetalOnlineCount = baremetalOnlineCount;
    }

    public Long getVpCount() {
        return vpCount;
    }

    public void setVpCount(Long vpCount) {
        this.vpCount = vpCount;
    }

    public Long getVpOnlineCount() {
        return vpOnlineCount;
    }

    public void setVpOnlineCount(Long vpOnlineCount) {
        this.vpOnlineCount = vpOnlineCount;
    }

    public Long getVmCount() {
        return vmCount;
    }

    public void setVmCount(Long vmCount) {
        this.vmCount = vmCount;
    }

    public Long getVmOnlineCount() {
        return vmOnlineCount;
    }

    public void setVmOnlineCount(Long vmOnlineCount) {
        this.vmOnlineCount = vmOnlineCount;
    }
}
