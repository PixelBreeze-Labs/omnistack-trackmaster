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