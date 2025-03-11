// src/app/api/external/omnigateway/types/campaigns.ts
export enum CampaignStatus {
    SCHEDULED = 'scheduled',
    SENT = 'sent',
    CANCELED = 'canceled'
  }
  
  export enum CampaignType {
    SMS = 'SMS',
    EMAIL = 'Email'
  }
  
  export interface Campaign {
    id: string;
    clientId: string;
    title: string;
    description: string;
    link?: string;
    type: CampaignType;
    target?: string;
    scheduledDate: string;
    sent: boolean;
    status: CampaignStatus;
    createdAt: string;
    updatedAt: string;
    externalIds: {
      venueBoostId?: string;
      [key: string]: string | undefined;
    };
    metadata?: {
      venueId?: number;
      vbPromotionId?: number;
      promotion?: {
        id: number;
        title: string;
        description: string;
        type: string;
        status: boolean;
      };
      [key: string]: any;
    };
  }
  
  export interface CampaignParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: CampaignStatus;
    type?: CampaignType;
    sent?: boolean;
  }
  
  export interface CampaignsResponse {
    data: Campaign[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }
  
  export interface SyncResponse {
    success: boolean;
    message: string;
    created: number;
    updated: number;
    unchanged: number;
    errors: number;
  }