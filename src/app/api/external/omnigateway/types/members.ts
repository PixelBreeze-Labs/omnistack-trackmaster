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


export interface BaseMember {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    brand?: string;
    source: 'from_my_club' | 'landing_page';
    status: 'pending' | 'approved' | 'rejected';
    applied_at: string;
    approved_at?: string;
    rejected_at?: string;
}

export interface LandingMember extends BaseMember {
    source: 'landing_page';
}

export interface ClubMember extends BaseMember {
    source: 'from_my_club';
    membership_type?: string;
    last_visit?: string;
}

export type ExternalMember = LandingMember | ClubMember;

export interface MemberParams {
    page?: number;
    per_page?: number;
    search?: string;
    registration_source?: 'from_my_club' | 'landing_page';
}

export interface ExternalMembersResponse {
    data: ExternalMember[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    metrics: MemberMetrics;
}