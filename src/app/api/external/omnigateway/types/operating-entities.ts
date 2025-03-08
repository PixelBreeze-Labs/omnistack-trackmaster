// app/api/external/omnigateway/types/operating-entities.ts
export interface OperatingEntity {
    _id: string;
    name: string;
    type: OperatingEntityType;
    url?: string;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export enum OperatingEntityType {
    SOCIAL_MEDIA_PLATFORM = 'SOCIAL_MEDIA_PLATFORM',
    MARKETING = 'MARKETING',
    NEWS_PORTAL = 'NEWS_PORTAL',
    OTHER = 'OTHER'
}

export type CreateOperatingEntityDto = {
    name: string;
    type: OperatingEntityType;
    url?: string;
    clientId: string;
}

export type UpdateOperatingEntityDto = Partial<CreateOperatingEntityDto>;

export interface OperatingEntityParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface OperatingEntityResponse {
    items: OperatingEntity[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}