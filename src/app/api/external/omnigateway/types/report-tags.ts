// app/api/external/omnigateway/types/report-tags.ts
export interface ReportTag {
    _id: string;
    name: string;
    description?: string;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateReportTagDto = {
    name: string;
    description?: string;
}

export type UpdateReportTagDto = Partial<CreateReportTagDto>;

export interface ReportTagParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ReportTagsResponse {
    data: ReportTag[];
    meta: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}