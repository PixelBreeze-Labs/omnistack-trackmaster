// types/family-accounts.ts
export interface FamilyMetrics {
    totalFamilies: number;
    activeAccounts: number;
    linkedMembers: number;
    averageSize: number;
    familySpendingMultiplier: number;
}


export interface LinkFamilyPayload {
    mainCustomerId: string;
    members: Array<{
        customerId: string;
        relationship: string;
    }>;
    sharedBenefits?: string[];
}


export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}


export interface FamilyStats {
    totalSpent: number;
    memberCount: number;
    recentActivities: Activity[];
    benefitsUsage: Array<{
        name: string;
        usageCount: number;
        savings: number;
    }>;
    joinedDate: string;
    lastActivity: string;
}




export interface UpdateFamilyPayload {
    members?: Array<{
        customerId: string;
        relationship: string;
    }>;
    sharedBenefits?: string[];
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface FamilyAccountsResponse {
    items: FamilyAccount[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    metrics: FamilyMetrics;
}

export interface Benefit {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface Activity {
    id: string;
    type: string;
    description: string;
    date: string;
}

export interface FamilyMember extends Customer {
    relationship: string;
    joinDate: string;
}

export interface FamilyAccount {
    id: string;
    clientId: string;
    // mainCustomerId: string;
    mainCustomerId: Customer;
    members: FamilyMember[];
    sharedBenefits: Benefit[];
    status: 'ACTIVE' | 'INACTIVE';
    lastActivity: string;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

export interface ListFamilyAccountsResponse {
    items: FamilyAccount[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    metrics: {
        totalFamilies: number;
        linkedMembers: number;
        averageSize: number;
        familySpendingMultiplier: number;
    };
}

export interface FamilyAccountStats {
    totalSpent: number;
    memberCount: number;
    recentActivities: any[];
    benefitsUsage: any[];
    joinedDate: string;
    lastActivity: string;
}