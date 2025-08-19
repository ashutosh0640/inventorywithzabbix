package com.ashutosh0640.inventy.zabbix.entity;

import com.ashutosh0640.inventy.entity.Project;
import jakarta.persistence.*;

@Entity
public class ZabbixServer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "zabbix_url" ,unique = true, nullable = false)
    private String url;

    private String username;

    private String password;

    @Column(nullable = false )
    private String token;

    private String status;

    @OneToOne
    @JoinColumn(name = "project_id", unique = true, nullable = false)
    private Project project;

    public ZabbixServer() {
        this.status = "OFFLINE";
    }

    public ZabbixServer(Long id, String name, String url, String username, String password, String token, String status, Project project) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.username = username;
        this.password = password;
        this.token = token;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
