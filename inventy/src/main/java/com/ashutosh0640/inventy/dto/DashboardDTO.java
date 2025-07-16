package com.ashutosh0640.inventy.dto;


import com.ashutosh0640.inventy.entity.ActivityLog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private Long locationCount;
    private Long projectCount;
    private Long rackCount;
    private Long baremetalCount;
    private Long baremetalOnlineCount;
    private Long vpCount;
    private Long vpOnlineCount;
    private Long vmCount;
    private Long vmOnlineCount;

}
