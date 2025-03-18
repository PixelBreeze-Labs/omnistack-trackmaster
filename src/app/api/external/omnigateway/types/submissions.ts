// app/api/external/omnigateway/types/submissions.ts
export type SubmissionType = 'contact' | 'newsletter' | 'booking' | 'feedback' | 'other';

export interface Submission {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    content?: string;
    clientId: string;
    type: SubmissionType;
    status: 'pending' | 'reviewed' | 'archived';
    metadata?: {
        timestamp: string;
        ipHash?: string;
        userAgent?: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SubmissionParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    type?: SubmissionType;
}

export interface SubmissionsResponse {
    items: Submission[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}