package com.ashutosh0640.inventy.zabbix.dto;


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

    public HostInterfaceDTO(String type, String main, String useIp, String ip, String dns, String port) {
        this.type = type;
        this.main = main;
        this.useIp = useIp;
        this.ip = ip;
        this.dns = dns;
        this.port = port;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMain() {
        return main;
    }

    public void setMain(String main) {
        this.main = main;
    }

    public String getUseIp() {
        return useIp;
    }

    public void setUseIp(String useIp) {
        this.useIp = useIp;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getDns() {
        return dns;
    }

    public void setDns(String dns) {
        this.dns = dns;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
}
