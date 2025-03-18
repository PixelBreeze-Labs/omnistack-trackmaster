// app/api/external/omnigateway/types/citizens.ts
export interface Citizen {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    external_ids: {
        nextJsUserId?: string;
        venueBoostId?: string;
        [key: string]: any;
    };
    registrationSource: string;
    client_ids: string[];
    points?: number;
    totalSpend?: number;
    clientTiers?: Record<string, string>;
    createdAt?: string;
    updatedAt?: string;
    reportCount?: number; // For active reporters query
}

export interface CitizenParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minReports?: number; // Only for active reporters
}

export interface CitizensResponse {
    data: Citizen[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}