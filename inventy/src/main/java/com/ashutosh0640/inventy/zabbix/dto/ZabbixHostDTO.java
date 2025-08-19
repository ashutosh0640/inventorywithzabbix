package com.ashutosh0640.inventy.zabbix.dto;


public class ZabbixHostDTO {
    private String id;
    private String hostName;
    private Long hostId;

    public ZabbixHostDTO() {    }

    public ZabbixHostDTO(String id, String hostName, Long hostId) {
        this.id = id;
        this.hostName = hostName;
        this.hostId = hostId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }
}
