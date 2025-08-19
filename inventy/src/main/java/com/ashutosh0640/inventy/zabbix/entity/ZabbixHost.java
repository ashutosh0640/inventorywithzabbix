package com.ashutosh0640.inventy.zabbix.entity;

import com.ashutosh0640.inventy.entity.Hosts;
import jakarta.persistence.*;

@Entity
public class ZabbixHost {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String hostName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="host_id")
    private Hosts host;

    public ZabbixHost() {    }

    public ZabbixHost(String id, String hostName, Hosts host) {
        this.id = id;
        this.hostName = hostName;
        this.host = host;
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

    public Hosts getHost() {
        return host;
    }

    public void setHost(Hosts host) {
        this.host = host;
    }
}
