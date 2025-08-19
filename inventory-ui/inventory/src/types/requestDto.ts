
export interface UserReqDTO {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    roleId?: number;
    isActive?: boolean;
    isBlocked?: boolean;
    profilePicture?: String | File | Blob;
}

export interface RoleReqDTO {
    roleName: string;
    permissionId?: number[];
}


export interface PermissionReqDTO {
    name: string;
    description?: string;
    resourceType: string;
    roleIds?: number[];
}

export interface LoginReqDTO {
    username: string;
    password: string;
}


export interface RegisterReqDTO {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    roleId?: number;
    isActive?: boolean;
    isBlocked?: boolean;
}



export interface LocationReqDTO {
    name: string;
    userIds?: number[];
}



export interface ProjectReqDTO {
    name: string;
    description?: string;
    locationIds?: number[];
    usersId?: number[];
}

export interface RackReqDTO {
    name: string;
    totalSlot: number;
    locationId: number;
    usersId?: number[];
}

export interface InterfacesDTO {
    ip: string;
    gateway: string;
    primaryDns: string;
    secondaryDns: string;
}

export interface BareMetalReqDTO {
    type: string;
    management: string;
    manufacturer: string;
    modelName: string;
    serialNumber: string;
    interfaces: InterfacesDTO[];
    rackId: number;
    rackSlotNumber: number;
    userIds: number[];
}

export interface NetworkDeviceReqDTO {
    type: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    osVersion: string;
    numberOfPort: number;
    interfaces: InterfacesDTO[];
    rackId: number;
    rackSlotNumber: number;
    userIds: number[];
}


export interface VirtualPlatformReqDTO {
    hostType: string;
    type: string;
    version: string;
    interfaces: InterfacesDTO[];
    cpuModel: string;
    cpuCores: number;
    ramSize: number;
    ramSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | string;
    storageSize: number;
    storageSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | string;
    storeageType: string;
    serverId: number;
    usersId?: number[];
}

export interface VirtualMachineReqDTO {
    vmName: string;
    os: string;
    osVersion: string;
    ipAddress: string;
    cpuCores: number;
    ramSize: number;
    ramSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | String;
    storageSize: number;
    storageSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | String;
    vpId: number;
    usersId?: number[];
}

export type HostType =
    | 'VIRTUAL_SERVER'
    | 'PHYSICAL_SERVER'
    | 'VIRTUALIZATION'
    | 'SWITCH'
    | 'ROUTER'
    | 'FIREWALL'
    | 'ACCESS_POINT';

export type ManagementType =
    | 'ILO'
    | 'IDRAC'
    | 'KVM'
    | 'IPMI'
    | 'RMM'
    | 'CIMC'
    | 'BMC_GENERIC'
    | 'OTHER';


export type ServerVendor =
    | 'Dell'
    | 'HPE'
    | 'Lenovo'
    | 'Cisco'
    | 'Supermicro'
    | 'Fujitsu'
    | 'IBM'
    | 'Oracle'
    | 'Huawei'
    | 'Alibaba'
    | 'CyberLogic'
    | 'Fujitsu'
    | 'Intel'
    | 'Samsung'
    | 'MSI'
    | 'Gigabyte';
