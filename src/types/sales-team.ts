// types/sales-team.ts
import { StaffRole, StaffStatus } from '@prisma/client';

export interface SalesTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: StaffRole;
  subRole: string | null;
  status: StaffStatus;
  employeeId: string;
  dateOfJoin: Date;
  performanceScore: number | null;
  avatar: string | null;
  department: {
    id: string;
    name: string;
  };
}

export interface SalesTeamStats {
  totalSales: number;
  salesGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
  activeAssociates: number;
  teamGrowth: number;
  avgPerformance: number;
  performanceGrowth: number;
}