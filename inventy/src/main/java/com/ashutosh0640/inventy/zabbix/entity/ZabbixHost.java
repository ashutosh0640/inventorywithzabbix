package com.ashutosh0640.inventy.zabbix.entity;

import com.ashutosh0640.inventy.entity.Hosts;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZabbixHost {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String hostName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="host_id")
    private Hosts host;
}
