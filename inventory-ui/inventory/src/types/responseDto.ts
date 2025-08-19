
export interface Role {
    id: number;
    roleName: 'ROOT' | 'ADMIN' | 'USER' | 'MONITOR' | String;
    user: User[];
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    description: string;
    resourceType: 'USER' | 'PROJECT' | 'SERVER' | 'VM' | 'VP' | string;
    role: Role[];
}


export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: Role;
    isActive: boolean;
    isBlocked: boolean;
    lastActive: string; // ISO string (from LocalDateTime)
    createdAt: string;
    updatedAt: string;
    profilePictureUrl: string;
}

export interface Login {
    id: number;
    username: string;
    role: string;
    token: string;
}

export interface Dashboard {
    locationCount: number;
    projectCount: number;
    rackCount: number;
    baremetalCount: number;
    baremetalOnlineCount: number;
    vpCount: number;
    vpOnlineCount: number;
    vmCount: number;
    vmOnlineCount: number;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    status: string;
    location: Location[];
    user: User[];
}

export interface Location {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    rack: Rack[];
    project: Project[];
    user: User[];
}

export interface Rack {
    id: number;
    name: string;
    totalSlot: number;
    occupiedSlot: number;
    createdAt: string;
    updatedAt: string;
    location: Location;
    server: BareMetal[];
    networkDevices: BareMetal[];
    user: User[];
}

export interface RackSlot {
    id: number;
    slotNumber: number;
    status: string;
}

export interface Interface {
    id: number;
    ip: string;
    main: boolean;
    gateway: string;
    primaryDns: string;
    secondaryDns: string;
    status: string;
}


export interface BareMetal {
    id: number;
    type: string;
    manufacturer: string;
    modelName: string;
    serialNumber: string;
    interfaces: Interface[];
    management: string;
    rack: Rack;
    rackSlotNumber: number;
    createdAt: string;
    updatedAt: string;
    vp: VirtualPlatform[];
    user: User[];
}


export interface NetworkDevices {
    id: number;
    type: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    osVersion: string,
    interfaces: Interface[];
    numberOfPort: number;
    rack: Rack;
    rackSlotNumber: number;
    users: User[]

}

export interface VirtualPlatform {
    id: number;
    hostType: string;
    type: string;
    version: string;
    interfaces: Interface[];
    cpuModel: string;
    cpuCores: number;
    ramSize: number;
    ramSizeUnit: string;
    storageSize: number;
    storageSizeUnit: string;
    storageType: string;
    createdAt: string;
    updatedAt: string;
    server: BareMetal;
    vm: VirtualMachine[];
    user: User[];
}

export interface VirtualMachine {
    id: number;
    hostName: string;
    os: string;
    version: string;
    cpuCores: number;
    ramSize: number;
    ramSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | String;
    storageSize: number;
    storageSizeUnit: 'KB' | 'MB' | 'GB' | 'TB' | String;
    ipAddress: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | string;
    createdAt: Date;
    updatedAt: Date;
    mgmt_controller: VirtualPlatform[];
    user: User[];
}

export interface RecentActivity {
    id: number;
    activityType: "READ" | "WRITE" | "DELETE" | "UPDATE" | string;
    details: string;
    timestamp: string;
    username: string;
}

export type ViewMode = 'card' | 'table';



export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  number: number; // current page (zero-based)
  size: number;   // size per page
  first: boolean;
  last: boolean;
  empty: boolean;
}






