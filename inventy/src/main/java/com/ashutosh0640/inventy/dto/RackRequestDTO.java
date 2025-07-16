package com.ashutosh0640.inventy.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RackRequestDTO {

    @NotBlank(message = "Rack name is required")
    private String name;

    private Short totalSlot;

    @NotNull(message = "Location id is required")
    private Long locationId;

    private Set<Long> usersId;

}
