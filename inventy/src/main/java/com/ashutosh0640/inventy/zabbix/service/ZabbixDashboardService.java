package com.ashutosh0640.inventy.zabbix.service;

import com.ashutosh0640.inventy.zabbix.dto.DashboardDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ZabbixDashboardService {

    private final ZabbixHostService hostService;
    private final ApiInfoService apiInfoService;
    private final ZabbixTemplateService templateService;
    private final ZabbixItemService itemService;
    private final ZabbixTriggerService triggerService;
    private final ZabbixUserService userService;

    public ZabbixDashboardService(ZabbixHostService hostService,
                                  ApiInfoService apiInfoService,
                                  ZabbixServerService zabbixServerService,
                                  ZabbixTemplateService templateService,
                                  ZabbixItemService itemService,
                                  ZabbixTriggerService triggerService,
                                  ZabbixServerService serverService,
                                  ZabbixUserService userService) {
        this.hostService = hostService;
        this.apiInfoService = apiInfoService;
        this.templateService = templateService;
        this.itemService = itemService;
        this.triggerService = triggerService;
        this.userService = userService;
    }


    public DashboardDTO getDashboardDetails(Long projcetId) throws JsonProcessingException {
        DashboardDTO dto = new DashboardDTO();
        boolean isZabbix = apiInfoService.isZabbixServerActive(projcetId);

        Map<String, Object> params = new HashMap<>();
        params.put("output", "hostid");
        Integer totalHost = hostService.getHostsCount(projcetId, params);

        Map<String, Object> filter = new HashMap<>();
        filter.put("status", 0);
        params.put("filter", filter);
        Integer enableHost = hostService.getHostsCount(projcetId, params);

        filter.replace("status", 1);
        Integer disableHost = hostService.getHostsCount(projcetId, params);

        params.clear();

        params.put("output", "templateid");
        Integer templateNumber = templateService.getTemplatesCount(projcetId, params);

        params.replace("output", "itemid");
        Integer itemsNumber = itemService.getItemsCount(projcetId, params);

        params.replace("output", "triggerid");
        Integer triggerNumber = triggerService.getTriggersCount(projcetId, params);

        params.replace("output", "userid");
        Integer userNumber = userService.getUserCount(projcetId, params);

        dto.setHostActive(isZabbix);
        dto.setTotalHostNumber(totalHost);
        dto.setEnableHstsNumber(enableHost);
        dto.setDisableHostsNumber(disableHost);
        dto.setTemplatesNumber(templateNumber);
        dto.setItemsNumber(itemsNumber);
        dto.setUsersNumber(userNumber);
        return dto;

    }
}
