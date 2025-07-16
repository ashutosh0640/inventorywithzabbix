package com.ashutosh0640.inventy.enums;

public enum HostType {

    VIRTUAL_SERVER,
    PHYSICAL_SERVER,
    VIRTUALIZATION,
    FIREWALL,
    ROUTER,
    SWITCH,
    STORAGE_DEVICE,      // NAS/SAN/DAS systems
    ACCESS_POINT,        // Wi-Fi APs and wireless bridges
    LOAD_BALANCER,       // Hardware load balancer (e.g., F5, Citrix)
    MODEM,               // Cable/DSL/fiber modem
    KVM_SWITCH,          // Keyboard/Video/Mouse hardware switch
    NETWORK_SECURITY_APPLIANCE, // Physical security hardware (UTM, IDS/IPS)
    POWER_DISTRIBUTION_UNIT,    // Intelligent PDUs for power control
    CONSOLE_SERVER,      // Serial console access devices
    UPS,                 // Uninterruptible Power Supply
    DESKTOP,             // Physical workstation
    LAPTOP,              // Portable workstation
    PRINTER,             // Network or local printers
    IOT_DEVICE           // Sensor, camera, smart device with a physical form
}

