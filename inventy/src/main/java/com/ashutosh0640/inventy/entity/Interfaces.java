package com.ashutosh0640.inventy.entity;

import com.ashutosh0640.inventy.enums.Status;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.ToString;



@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "interfaces")
public class Interfaces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ip;

    @Column(nullable = false)
    private boolean main;

    private String gateway;

    @Column(name = "primary_dns")
    private String primaryDns;

    @Column(name = "secondary_dns")
    private String secondaryDns;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OFFLINE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Hosts host;

    public Interfaces() {
        this.main = true;
        this.gateway = "";
        this.primaryDns= "8.8.8.8";
        this.secondaryDns= "8.8.4.4";
    }

}

