interface SelectOption {
    value: string;
    label: string;
}

export const dataUnit: SelectOption[] = [
    { value: '', label: 'Select Data Unit' },
    { value: 'KB', label: 'KB' },
    { value: 'MB', label: 'MB' },
    { value: 'GB', label: 'GB' },
    { value: 'TB', label: 'TB' },
];

export const virtualizationOptions: SelectOption[] = [
    { value: '', label: 'Select Virtualization Platform' },
    { value: 'ESXi', label: 'VMware ESXi' },
    { value: 'vCenter', label: 'VMware vCenter' },
    { value: 'KVM', label: 'Kernel-based Virtual Machine (KVM)' },
    { value: 'HyperV', label: 'Microsoft Hyper-V' },
    { value: 'VirtualBox', label: 'Oracle VirtualBox' },
    { value: 'Xen', label: 'Xen' },
    { value: 'Proxmox', label: 'Proxmox VE' },
];

export const cpuCoresOptions: SelectOption[] = [
    { value: '', label: 'Select CPU Cores' },
    { value: '1', label: '1 Core' },
    { value: '2', label: '2 Cores' },
    { value: '4', label: '4 Cores' },
    { value: '6', label: '6 Cores' },
    { value: '8', label: '8 Cores' },
    { value: '12', label: '12 Cores' },
    { value: '16', label: '16 Cores' },
    { value: '24', label: '24 Cores' },
    { value: '32', label: '32 Cores' },
    { value: '64', label: '64 Cores' },
    { value: '128', label: '128 Cores' },
];

export const storageTypeOptions: SelectOption[] = [
    { value: '', label: 'Select Storage Type' },
    { value: 'HDD', label: 'Hard Disk Drive (HDD)' },
    { value: 'SSD', label: 'Solid State Drive (SSD)' },
    { value: 'NVMe', label: 'Non-Volatile Memory Express (NVMe)' },
    { value: 'SAN', label: 'Storage Area Network (SAN)' },
    { value: 'NAS', label: 'Network-Attached Storage (NAS)' },
];


export const serverVendors: SelectOption[] = [
    { value: '', label: 'Select Manufacturer' },
    { value: 'HP', label: 'Hewlett Packard Enterprise' },
    { value: 'Dell', label: 'Dell Technologies' },
    { value: 'Supermicro', label: 'Supermicro' },
    { value: 'IBM', label: 'IBM' },
    { value: 'Huawei', label: 'Huawei' },
    { value: 'Intel', label: 'Intel' },
    { value: 'Oracle', label: 'Oracle' },
    { value: 'Lenovo', label: 'Lenovo' },
    { value: 'Cisco', label: 'Cisco Systems' },
];

export const managementTypeOptions: SelectOption[] = [
    { value: '', label: 'Select Management Type' },
    { value: 'ILO', label: 'ILO' },
    { value: 'IDRAC', label: 'IDRAC' },
    { value: 'KVM', label: 'KVM' },
    { value: 'IPMI', label: 'IPMI' },
    { value: 'RMM', label: 'RMM' },
    { value: 'CIMC', label: 'CIMC' },
    { value: 'BMC_GENERIC', label: 'BMC_GENERIC' },
    { value: 'OTHER', label: 'OTHER' }
];

export const networkHost: string[] = [
  'SWITCH',
  'ROUTER',
  'FIREWALL',
  'ACCESS_POINT'
];


export const commonPortCounts: number[] = [
  4,
  5,
  8,
  12,
  16,
  24,
  48,
  96
];