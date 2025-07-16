package com.ashutosh0640.inventy.zabbix.entity;

import com.ashutosh0640.inventy.entity.Project;
import jakarta.persistence.*;
import lombok.*;



@Entity
@Getter
@Setter
@AllArgsConstructor
@ToString
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


}
