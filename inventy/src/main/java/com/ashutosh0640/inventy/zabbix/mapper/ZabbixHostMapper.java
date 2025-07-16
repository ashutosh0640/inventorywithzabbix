package com.ashutosh0640.inventy.zabbix.mapper;

import com.ashutosh0640.inventy.dto.VirtualMachineRequestDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ZabbixHostMapper {

    public static Map<String, Object> toZabbixHostMap(VirtualMachineRequestDTO dto) {

        Map<String, Object> params = new HashMap<>();
        params.put("host", dto.getHostName());

        Map<String, Object> maps = new HashMap<>();
        List<Map<String, Object>> interfaces =  dto.getInterfaces().stream().map(i-> {

            maps.put("type", "1"); // Agent
            maps.put("main", "1");
            maps.put("useip", "1");
            maps.put("ip", i.getIp());
            maps.put("dns", i.getPrimaryDns());
            maps.put("port", "10050");
            return maps;
        }).toList();
        params.put("interfaces", interfaces);

        maps.clear();

        List<Map<String, Object>> groups = dto.getGroupId().stream()
                .map(g->{
                    maps.put("groupid", g);
                    return maps;
                }).toList();

        params.put("groups", maps);

        maps.clear();

        List<Map<String, Object>> templates = dto.getTemplateId().stream()
                .map(g->{
                    maps.put("groupid", g);
                    return maps;
                }).toList();

        params.put("templateid", maps);
        maps.clear();

//        String type = dto.getHostType().toUpperCase();

//        if (dto.getHostType() == "WINDOWS_SERVER") {
//
//        }


        return params;
    }
}
