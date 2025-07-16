
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
    rackName: string;
    locationId: number;
    usersId?: number[];
}

export interface BareMetalReqDTO {
    brandName: string;
    serverName: string;
    modelName: string;
    serialNumber: string;
    ipAddress: string;
    operatingSystem: string;
    rackId: number;
    rackPosition: string;
    userIds?: number[];
}




export interface VirtualPlatformReqDTO {
    platformName: string;
    version: string;
    ipAddress: string;
    cpuCores: number;
    ramSize: number;
    ramSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | string;
    storageSize: number;
    storageSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | string;
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