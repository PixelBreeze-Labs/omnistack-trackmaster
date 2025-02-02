// types/members.ts
export interface Member {
    _id: string;
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    birthday?: string;
    country?: string;
    city?: string;
    address?: string;
    code: string;
    acceptedAt?: string;
    isRejected: boolean;
    rejectedAt?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export type CreateMemberDto = {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    birthday?: string;
    country?: string;
    city?: string;
    address?: string;
    code: string;
    acceptedAt?: string;
    isRejected?: boolean;
    rejectedAt?: string;
    metadata?: Record<string, any>;
}

export type UpdateMemberDto = Partial<CreateMemberDto>;

export interface MemberParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'rejected' | 'all';
}

export interface MemberMetrics {
    totalMembers: number;
    activeMembers: number;
    pendingMembers: number;
    rejectedMembers: number;
    trends: {
        members: { value: number; percentage: number; };
        active: { value: number; percentage: number; };
        pending: { value: number; percentage: number; };
        rejected: { value: number; percentage: number; };
    };
}

export interface MembersResponse {
    items: Member[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    metrics: MemberMetrics;
}