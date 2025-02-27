import { Business } from './business';

export interface CreateOmniStackUserData {
    name: string;
    surname: string;
    email: string;
    password: string;
    external_ids?: string[];
  }
  
  export interface OmniStackUserResponse {
    id: string;
    email: string;
    name: string;
    surname: string;
    status: string;
    external_ids: string[];
  }
  



export enum RegistrationSource {
    METROSUITES = 'metrosuites',
    METROSHOP = 'metroshop',
    BOOKMASTER = 'bookmaster',
    TRACKMASTER = 'trackmaster',
    OTHER = 'other',
    MANUAL = 'manual',
    STAFFLUENT = 'staffluent',
}

export interface User {
    _id: string;
    name: string;
    surname: string;
    email: string;
    registrationSource: RegistrationSource;
    external_ids: Record<string, any>;
    client_ids: string[];
    metadata: Map<string, any>;
    isActive: boolean;
    storeIds?: string[];
    primaryStoreId?: string;
    points?: number;
    totalSpend?: number;
    birthday?: string;
    clientTiers?: Record<string, string>;
    referralCode?: string;
    referredBy?: string;
    referralsRemaining?: number;
    referrals?: string[];
    walletId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StaffUser {
    user: User;
    businesses: Business[];
}

export interface StaffUserParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
}

export interface StaffUsersResponse {
    items: StaffUser[];
    total: number;
    pages: number;
}