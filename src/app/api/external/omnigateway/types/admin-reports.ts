// app/api/external/omnigateway/types/admin-reports.ts
export enum ReportStatus {
    PENDING_REVIEW = 'pending_review',
    REJECTED = 'rejected',
    ACTIVE = 'active',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    NO_RESOLUTION = 'no_resolution'
}

export interface Location {
    lat: number;
    lng: number;
    accuracy?: number;
}

export interface AdminReport {
    _id: string;
    title: string;
    content: {
        message: string;
        name?: string;
        files?: any[];
    };
    status: string;
    category: string;
    isAnonymous: boolean;
    isFeatured: boolean;
    customAuthorName?: string;
    visibleOnWeb: boolean;
    location?: Location;
    authorId?: string;
    media?: string[];
    audio?: string;
    tags: string[];
    reportTags: string[];
    createdAt: string;
    updatedAt: string;
    isCommunityReport: boolean;
    isFromChatbot?: boolean;
    clientId: string;
    viewCount?: number;
    commentCount?: number;
    flagCount?: number;
}

export interface AdminReportParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tags?: string[];
    reportTags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface AdminReportsResponse {
    data: AdminReport[];
    meta: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}


export enum CommentStatus {
    PENDING_REVIEW = 'pending_review',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum FlagStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    DISMISSED = 'dismissed'
}

export enum FlagReason {
    INAPPROPRIATE = 'inappropriate',
    SPAM = 'spam',
    MISINFORMATION = 'misinformation',
    DUPLICATE = 'duplicate',
    OTHER = 'other'
}

export interface Location {
    lat: number;
    lng: number;
    accuracy?: number;
}

export interface AdminReportParams {
    search?: string;
    limit?: number;
    page?: number;
    status?: string;
    category?: string;
    tags?: string[];
    reportTags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}


export interface ReportComment {
    id: string;
    content: string;
    author?: {
        id: string;
        name: string;
    };
    status: CommentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ReportFlag {
    id: string;
    reason: FlagReason;
    comment?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    status: FlagStatus;
    createdAt: string;
}