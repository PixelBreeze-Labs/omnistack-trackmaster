// types/family-accounts.ts
export interface FamilyMember {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relationship: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    joinDate: string;
}

export interface FamilyAccount {
    id: string;
    mainAccount: {
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        status: 'ACTIVE' | 'INACTIVE';
        joinDate: string;
    };
    memberCount: number;
    totalSpent: number;
    lastActivity: string;
    sharedBenefits: string[];
    members: FamilyMember[];
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