package com.ashutosh0640.inventy.enums;

public enum InterfaceType {

    AGENT(1),
    SNMP(2),
    IPMI(3),
    JMX(4);

    private final int code;

    InterfaceType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}

