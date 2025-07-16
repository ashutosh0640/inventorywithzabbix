package com.ashutosh0640.inventy.enums;

public enum InterfaceUseIp {
    DNS(0),
    IP(1);

    private final int code;

    InterfaceUseIp(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
