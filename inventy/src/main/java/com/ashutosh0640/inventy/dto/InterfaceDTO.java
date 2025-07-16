package com.ashutosh0640.inventy.dto;

import com.ashutosh0640.inventy.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterfaceDTO {

    private Long id;
    private String ip;
    private String gateway;
    private String primaryDns;
    private String secondaryDns;
    private Status status = Status.OFFLINE;

}
