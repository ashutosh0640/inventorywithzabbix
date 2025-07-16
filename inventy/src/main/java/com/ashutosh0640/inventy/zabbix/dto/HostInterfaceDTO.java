package com.ashutosh0640.inventy.zabbix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class HostInterfaceDTO {

    private String type;          // Type: "agent", "snmp", "ipmi", "jmx"
    private String main;          // 1 or 0 (main interface)
    private String useIp;         // 1 or 0
    private String ip;            // IP address
    private String dns;           // DNS name
    private String port;          // port number

    public HostInterfaceDTO() {
        this.type = "1"; // default type 1 (agent)
        this.main = "1"; // default main
        this.useIp = "1"; // default use IP
        this.ip = "";
        this.dns = "";
        this.port = "10050"; // default agent port
    }
}
