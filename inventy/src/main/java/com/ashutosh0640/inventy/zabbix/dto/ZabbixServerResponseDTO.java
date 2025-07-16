package com.ashutosh0640.inventy.zabbix.dto;

import com.ashutosh0640.inventy.dto.ProjectResponseDTO;
import com.ashutosh0640.inventy.enums.Status;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ZabbixServerResponseDTO {

    private Long id;
    private String name;
    private String url;
    private String username;
    private String status;
    private ProjectResponseDTO project;

}
