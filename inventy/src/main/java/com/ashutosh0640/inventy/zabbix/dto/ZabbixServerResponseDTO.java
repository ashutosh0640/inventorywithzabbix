package com.ashutosh0640.inventy.zabbix.dto;

import com.ashutosh0640.inventy.dto.ProjectResponseDTO;


public class ZabbixServerResponseDTO {

    private Long id;
    private String name;
    private String url;
    private String username;
    private String status;
    private ProjectResponseDTO project;

    public ZabbixServerResponseDTO() {    }

    public ZabbixServerResponseDTO(Long id, String name, String url, String username, String status, ProjectResponseDTO project) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.username = username;
        this.status = status;
        this.project = project;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ProjectResponseDTO getProject() {
        return project;
    }

    public void setProject(ProjectResponseDTO project) {
        this.project = project;
    }
}
