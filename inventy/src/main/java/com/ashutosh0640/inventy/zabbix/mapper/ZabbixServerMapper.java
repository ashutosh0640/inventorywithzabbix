package com.ashutosh0640.inventy.zabbix.mapper;

import com.ashutosh0640.inventy.entity.Project;
import com.ashutosh0640.inventy.mapper.ProjectMapper;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerRequestDTO;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerResponseDTO;
import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;

public class ZabbixServerMapper {

    // Convert DTO to Entity
    public static ZabbixServer toEntity(ZabbixServerRequestDTO dto, Project project) {
        if (dto == null) return null;

        ZabbixServer server = new ZabbixServer();
        server.setName(dto.getName());
        server.setUrl(dto.getUrl());
        server.setUsername(dto.getUsername());
        server.setPassword(dto.getPassword());
        server.setToken(dto.getToken());
        server.setProject(project);
        return server;
    }



    // Convert Entity to DTO
    public static ZabbixServerResponseDTO toDTO(ZabbixServer entity) {
        if (entity == null) return null;
        ZabbixServerResponseDTO dto = new ZabbixServerResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setUrl(entity.getUrl());
        dto.setUsername(entity.getUsername());
        dto.setStatus(entity.getStatus());
        return dto;
    }


    public static ZabbixServerResponseDTO toDTO (ZabbixServer entity, Project project) {
        ZabbixServerResponseDTO dto = toDTO(entity);
        dto.setProject(ProjectMapper.toDTO(project));
        System.out.println("zabbix server project name: "+dto.getProject().getName());
        return dto;
    }


}
