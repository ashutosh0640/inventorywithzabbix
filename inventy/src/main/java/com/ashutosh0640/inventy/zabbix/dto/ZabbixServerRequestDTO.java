package com.ashutosh0640.inventy.zabbix.dto;


public class ZabbixServerRequestDTO {

    private String name;
    private String url;
    private String username;
    private String password;
    private String token;
    private Long projectId;

    public ZabbixServerRequestDTO() {    }

    public ZabbixServerRequestDTO(String name, String url, String username, String password, String token, Long projectId) {
        this.name = name;
        this.url = url;
        this.username = username;
        this.password = password;
        this.token = token;
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
