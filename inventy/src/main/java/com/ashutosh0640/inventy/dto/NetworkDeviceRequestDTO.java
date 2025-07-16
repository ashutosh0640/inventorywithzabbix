package com.ashutosh0640.inventy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class NetworkDeviceRequestDTO {

    @NotBlank(message = "Device name is required.")
    private String name;

    @NotBlank(message = "Type is required.")
    private String type;

    @NotBlank(message = "Manufacturer name is required.")
    private String manufacturer;

    @NotBlank(message = "Model is required.")
    private String model;

    @NotBlank(message = "OS version is required.")
    private String osVersion;

    @NotBlank(message = "Serial number is required.")
    private String serialNumber;

    private Short numberOfPort;

    @NotBlank(message = "Interfaces is required.")
    private Set<InterfaceDTO> interfaces;

    @NotNull(message = "Rack ID is required")
    private Long rackId;

    @NotBlank(message = "Rack slot number is required.")
    private Short rackSlotNumber;

    private Set<Long> userIds;
}
