package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.ManagementType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BareMetalServerResponseDTO {

    private Long id;
    private String name;
    private HostType type;
    private String manufacturer;
    private String modelName;
    private String serialNumber;
    private Set<InterfaceDTO> interfaces;
    private ManagementType management;
    private Long rackId;
    private Short rackSlotNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<VirtualizationsResponseDTO> vp;
    private Set<UserResponseDTO> user;

}
