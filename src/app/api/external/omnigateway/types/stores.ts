export interface Store {
    id: string;
    name: string;
    code: string;
    status: 'ACTIVE' | 'INACTIVE';
    address?: {
        addressLine1: string;
        addressLine2?: string;
        postcode: string;
        city: any;
        state: any;
        country: any;
    };
    userIds?: string[];
    metadata?: Record<string, any>;
}