package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.ManagementType;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BareMetalServerRequestDTO {


    @NotBlank(message = "Server name is required.")
    private String name;

    @NotBlank(message = "Type is required.")
    private String type;

    private String management;

    @NotBlank(message = "Brand name is required.")
    private String manufacturer;

    @NotBlank(message = "Model name is required.")
    private String modelName;

    @NotBlank(message = "Serial number is required.")
    private String serialNumber;

    @NotBlank(message = "Interfaces is required.")
    private Set<InterfaceDTO> interfaces;

    @NotNull(message = "Rack ID is required")
    private Long rackId;

    private Short rackSlotNumber;

    private Set<Long> userIds;

}
