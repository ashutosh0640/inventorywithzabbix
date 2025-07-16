package com.ashutosh0640.inventy.dto;


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
public class LocationRequestDTO {

    @NotBlank(message = "Location name is required.")
    private String name;
    private Set<Long> userIds;

}

