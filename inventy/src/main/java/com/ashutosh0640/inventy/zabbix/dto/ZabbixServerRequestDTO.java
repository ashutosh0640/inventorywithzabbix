package com.ashutosh0640.inventy.zabbix.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ZabbixServerRequestDTO {

    private String name;
    private String url;
    private String username;
    private String password;
    private String token;
    private Long projectId;
}
