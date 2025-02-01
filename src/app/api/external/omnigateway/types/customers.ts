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

export interface CustomerFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    type: 'REGULAR' | 'VIP';
    status: 'ACTIVE' | 'INACTIVE';
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
