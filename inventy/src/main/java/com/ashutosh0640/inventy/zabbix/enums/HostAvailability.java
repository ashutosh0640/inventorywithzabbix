package com.ashutosh0640.inventy.zabbix.enums;

public enum HostAvailability {
    UNKNOWN(0),
    UNAVAILABLE(1),
    AVAILABLE(2);

    private final int value;

    HostAvailability(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}