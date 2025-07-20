package com.ashutosh0640.inventy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RackResponseDTO {

    private Long id;
    private String name;
    private Short totalSlot;
    private Long occupiedSlot;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocationResponseDTO location;
    private Set<BareMetalServerResponseDTO> server;
    private Set<NetworkDeviceResponseDTO> networkDevices;
    private Set<UserResponseDTO> user;

}
