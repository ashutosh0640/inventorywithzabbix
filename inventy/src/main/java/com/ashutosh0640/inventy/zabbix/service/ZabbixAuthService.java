package com.ashutosh0640.inventy.zabbix.service;

import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;
import com.ashutosh0640.inventy.zabbix.repository.ZabbixServerRepository;
import org.springframework.stereotype.Service;

@Service
public class ZabbixAuthService {

    private ZabbixServerRepository zabbixServerRepository;

//    public ZabbixServer getZabbixServerByProject(Long projectId) {
//        return zabbixServerRepository.findByProjectIdAndUserId(projectId)
//                .orElseThrow(() -> new RuntimeException("Zabbix server not found for project ID: " + projectId));
//    }
}
