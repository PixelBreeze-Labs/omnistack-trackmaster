export interface Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    _count?: {
      staff: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: StaffRole;
    subRole?: string;
    status: StaffStatus;
    employeeId: string;
    dateOfJoin: Date;
    canAccessApp: boolean;
    performanceScore?: number;
    avatar?: string;
    department: Department;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum StaffRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    SUPERVISOR = 'SUPERVISOR',
    SALES = 'SALES',
    STAFF = 'STAFF',
    SUPPORT = 'SUPPORT'
  }
  
  export enum StaffStatus {
    ACTIVE = 'ACTIVE',
    ON_LEAVE = 'ON_LEAVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
  }