package com.ashutosh0640.inventy.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationDetailsDTO {

    private String location;
    private Long rackCount;
    private Long baremetalCount;
    private Long networkDeviceCount;
    private Long slotsCount;
    private BigDecimal rackOccupiedPer;

}
