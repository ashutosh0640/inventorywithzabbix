package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "interfaces")
public class Interfaces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = false)
    private String ip;

    @Column(nullable = false)
    private boolean main;

    private String gateway;

    @Column(name = "primary_dns")
    private String primaryDns;

    @Column(name = "secondary_dns")
    private String secondaryDns;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OFFLINE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Hosts host;


    public Interfaces() {
        this.main = true;
        this.gateway = "";
        this.primaryDns= "8.8.8.8";
        this.secondaryDns= "8.8.4.4";
    }

    public Interfaces(Long id, String ip, boolean main, String gateway, String primaryDns, String secondaryDns, Status status, Hosts host) {
        this.id = id;
        this.ip = ip;
        this.main = main;
        this.gateway = gateway;
        this.primaryDns = primaryDns;
        this.secondaryDns = secondaryDns;
        this.status = status;
        this.host = host;
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

    public boolean isMain() {
        return main;
    }

    public void setMain(boolean main) {
        this.main = main;
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

    public Hosts getHost() {
        return host;
    }

    public void setHost(Hosts host) {
        this.host = host;
    }
}

