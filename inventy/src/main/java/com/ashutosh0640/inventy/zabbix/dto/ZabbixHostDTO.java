package com.ashutosh0640.inventy.zabbix.dto;

import com.ashutosh0640.inventy.entity.Hosts;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.zabbix.enums.HostAvailability;
import com.ashutosh0640.inventy.zabbix.enums.ZabbixHostStauts;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ZabbixHostDTO {
    private String id;

    private String hostName;

    private Long hostId;
}
