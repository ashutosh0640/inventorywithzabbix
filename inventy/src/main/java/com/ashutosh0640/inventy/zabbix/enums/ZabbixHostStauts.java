package com.ashutosh0640.inventy.zabbix.enums;



public enum ZabbixHostStauts {
    MONITORED(0),
    UNMONITORED(1),
    DISCOVERED(2);

    private final int value;

    ZabbixHostStauts(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}