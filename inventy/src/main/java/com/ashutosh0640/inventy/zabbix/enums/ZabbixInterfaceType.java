package com.ashutosh0640.inventy.zabbix.enums;

import lombok.Data;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public enum ZabbixInterfaceType {
    AGENT(1, "Zabbix Agent"),
    SNMP(2, "SNMP"),
    IPMI(3, "IPMI"),
    JMX(4, "JMX");

    private final int code;
    private final String label;

    ZabbixInterfaceType(int code, String label) {
        this.code = code;
        this.label = label;
    }

    public int getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }


    public static List<Map<String, Object>> interfaceTypes() {
        return Arrays.stream(values())
                .map(type -> Map.of(
                        "code", (Object) type.code,
                        "label", (Object) type.label
                ))
                .collect(Collectors.toList());
    }

}
