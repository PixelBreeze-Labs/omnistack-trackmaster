// src/app/api/external/omnigateway/types/guests.ts

export type GuestStatus = 'ACTIVE' | 'INACTIVE';
export type FilterStatus = 'ACTIVE' | 'INACTIVE' | 'ALL';
export type FilterSource = 'metrosuites' | 'manual' | 'ALL';

export interface Guest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    userId: string | null;
    clientIds: string[];
    external_ids: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    
    // Fields populated from User relationship
    source?: string;
    points?: number;
    totalSpend?: number;
    membershipTier?: string;
    walletBalance?: number;
}

export interface GuestParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: FilterStatus;
    source?: FilterSource;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GuestMetrics {
    totalGuests: number;
    activeGuests: number;
    guestGrowth: number;
    trends: {
        guests: { value: number; percentage: number };
        active: { value: number; percentage: number };
    }
}