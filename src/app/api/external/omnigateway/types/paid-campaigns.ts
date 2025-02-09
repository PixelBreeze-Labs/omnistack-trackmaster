export interface PaidCampaign {
    _id: string;
    clientId: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    utmTerm?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaidCampaignStats {
    viewCount: number;
    cartCount: number;
    purchaseCount: number;
    revenue: number;
    conversionRate: string;
  }
  
  export interface PaidCampaignDetailsResponse {
    campaign: PaidCampaign;
    stats: PaidCampaignStats;
  }
  
  export interface ListPaidCampaignsDto {
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface PaidListCampaignsResponse {
    items: PaidCampaign[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }
  