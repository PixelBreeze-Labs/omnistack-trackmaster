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
    events: CampaignEvent[];
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

  export interface PaidCampaignParamsDto {
    utmSource: string;    // e.g. 'facebook'
    utmMedium: string;    // e.g. 'cpc'
    utmCampaign: string;  // campaign name
    utmContent?: string;  // ad content
    utmTerm?: string;     // keywords
   }

   export interface CampaignEvent {
    _id: string;
    eventType: 'view_product' | 'add_to_cart' | 'purchase';
    external_product_ids?: Record<string, any>;
    external_order_ids?: Record<string, any>;
    eventData: {
      quantity?: number;
      price?: number;
      currency?: string;
      total?: number;
    };
    createdAt: string;
  }
  
  