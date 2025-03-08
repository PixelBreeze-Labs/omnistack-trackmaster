// app/api/external/omnigateway/types/social-profiles.ts
export interface SocialProfile {
    _id: string;
    type: SocialProfileType;
    accountName: string;
    username: string;
    url?: string;
    operatingEntityId: string;
    operatingEntity?: {
        _id: string;
        name: string;
        type: string;
        url?: string;
    };
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export enum SocialProfileType {
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
    TIKTOK = 'TIKTOK',
    TWITTER = 'TWITTER',
    LINKEDIN = 'LINKEDIN',
    YOUTUBE = 'YOUTUBE',
    OTHER = 'OTHER'
}

export type CreateSocialProfileDto = {
    type: SocialProfileType;
    accountName: string;
    username: string;
    url?: string;
    operatingEntityId: string;
    clientId: string;
}

export type UpdateSocialProfileDto = Partial<CreateSocialProfileDto>;

export interface SocialProfileParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    operatingEntityId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SocialProfileResponse {
    items: SocialProfile[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}