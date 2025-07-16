package com.ashutosh0640.inventy.enums;

public enum VirtualizationType {

    // Type-1 Hypervisors (bare-metal)
    VMWARE_ESXI,
    HYPER_V,
    KVM,
    XEN,
    OVM,             // Oracle VM
    RHEV,            // Red Hat Virtualization (based on KVM)
    AHV,             // Nutanix Acropolis Hypervisor

    // Type-2 Hypervisors (hosted)
    VIRTUALBOX,
    VMWARE_WORKSTATION,
    QEMU,

    OTHER
}
