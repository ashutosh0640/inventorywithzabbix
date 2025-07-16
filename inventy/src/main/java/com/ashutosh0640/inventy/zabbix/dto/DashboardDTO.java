package com.ashutosh0640.inventy.zabbix.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private boolean isHostActive;
    private Integer totalHostNumber;
    private Integer enableHstsNumber;
    private Integer disableHostsNumber;
    private Integer templatesNumber;
    private Integer itemsNumber;
    private Integer triggersNumber;
    private Integer usersNumber;

}
