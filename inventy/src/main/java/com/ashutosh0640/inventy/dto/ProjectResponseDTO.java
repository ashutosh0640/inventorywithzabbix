package com.ashutosh0640.inventy.dto;

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
public class ProjectResponseDTO {

    private Long id; // Included for responses
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private Set<LocationResponseDTO> location;
    private Set<UserResponseDTO> user;


}
