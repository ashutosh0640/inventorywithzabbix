package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.HostType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class NetworkDeviceResponseDTO {

    private Long id;

    private String name;

    private HostType type;

    private String manufacturer;

    private String model;

    private String osVersion;

    private String serialNumber;

    private Short numberOfPort;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Set<InterfaceDTO> interfaces;

    private RackResponseDTO rack;

    private Short rackSlotNumber;

    private Set<UserResponseDTO> users;
}
