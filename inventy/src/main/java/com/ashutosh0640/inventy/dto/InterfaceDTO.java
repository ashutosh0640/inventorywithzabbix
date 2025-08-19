package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.Status;

public class InterfaceDTO {

    private Long id;
    private String ip;
    private String gateway;
    private String primaryDns;
    private String secondaryDns;
    private Status status = Status.OFFLINE;

    public InterfaceDTO() {}

    public InterfaceDTO(Long id, String ip, String gateway, String primaryDns, String secondaryDns, Status status) {
        this.id = id;
        this.ip = ip;
        this.gateway = gateway;
        this.primaryDns = primaryDns;
        this.secondaryDns = secondaryDns;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getGateway() {
        return gateway;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }

    public String getPrimaryDns() {
        return primaryDns;
    }

    public void setPrimaryDns(String primaryDns) {
        this.primaryDns = primaryDns;
    }

    public String getSecondaryDns() {
        return secondaryDns;
    }

    public void setSecondaryDns(String secondaryDns) {
        this.secondaryDns = secondaryDns;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
