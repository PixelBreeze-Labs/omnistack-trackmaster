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
