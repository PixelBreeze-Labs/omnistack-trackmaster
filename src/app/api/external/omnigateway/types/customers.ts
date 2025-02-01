export type CustomerStatus = 'ACTIVE' | 'INACTIVE';
export type CustomerType = 'REGULAR' | 'VIP';
export type LoyaltyTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'NONE';
export type FilterStatus = 'ACTIVE' | 'INACTIVE' | 'ALL';
export type FilterType = 'REGULAR' | 'VIP' | 'ALL';

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: 'REGULAR' | 'VIP';
    orders: number;
    lastOrder: string;
    firstOrder: string;
    registrationDate: string;
    totalSpent: number;
    avatar?: string;
}

export interface ListCustomersResponse {
    items: Customer[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: CustomerStatus;
    type: CustomerType;
    orders: number;
    lastOrder: string;
    firstOrder: string;
    registrationDate: string;
    totalSpent: number;
    avatar?: string;
    loyaltyTier: LoyaltyTier;
  }

export interface CustomerParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
    type?: 'REGULAR' | 'VIP' | 'ALL';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
 }
 
 export interface CustomerMetrics {
    totalCustomers: number;
    activeCustomers: number;
    averageOrderValue: number;
    customerGrowth: number;
    trends: {
        customers: { value: number; percentage: number };
        active: { value: number; percentage: number };
        orderValue: { value: number; percentage: number };
        growth: { value: number; percentage: number };
    }
 }
