package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.InterfaceDTO;
import com.ashutosh0640.inventy.entity.Hosts;
import com.ashutosh0640.inventy.entity.Interfaces;

public class InterfaceMapper {

    public static Interfaces toEntity(InterfaceDTO dto) {
        Interfaces interf = new Interfaces();
        interf.setIp(dto.getIp());
        interf.setIp(dto.getIp());
        if (dto.getGateway() != null) {
            interf.setGateway(dto.getGateway());
        }
        if (dto.getPrimaryDns() != null) {
            interf.setPrimaryDns(dto.getPrimaryDns());
        }
        if (dto.getSecondaryDns() != null) {
            interf.setSecondaryDns(dto.getSecondaryDns());
        }
        return interf;
    }

    public static Interfaces toEntity(InterfaceDTO dto, Hosts host) {
        Interfaces interf = InterfaceMapper.toEntity(dto);
        interf.setHost(host);
        return interf;
    }



    public static InterfaceDTO toDTO(Interfaces interfaces) {
        InterfaceDTO dto = new InterfaceDTO();
        dto.setId(interfaces.getId());
        dto.setIp(interfaces.getIp());
        dto.setGateway(interfaces.getGateway());
        dto.setPrimaryDns(interfaces.getPrimaryDns());
        dto.setSecondaryDns(interfaces.getSecondaryDns());
        dto.setStatus(interfaces.getStatus());
        return dto;
    }
}
