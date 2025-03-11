// src/app/api/external/omnigateway/types/promotions.ts
export enum DiscountType {
    FIXED = 'fixed',
    PERCENTAGE = 'percentage'
  }
  
  export interface Promotion {
    id: string;
    clientId: string;
    title: string;
    description: string;
    type: string; // 'discount' or 'coupon'
    status: boolean;
    startTime?: string;
    endTime?: string;
    createdAt: string;
    updatedAt: string;
    externalIds: {
      venueBoostId?: string;
      [key: string]: string | undefined;
    };
    metadata?: {
      venueId?: number;
      discountIds?: string[];
      [key: string]: any;
    };
  }
  
  export interface PromotionParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: boolean;
    type?: string;
  }
  
  export interface PromotionsResponse {
    data: Promotion[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }
  
  export interface Discount {
    id: string;
    clientId: string;
    promotionId?: string;
    type: DiscountType;
    value: number;
    status: boolean;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    externalIds: {
      venueBoostId?: string;
      [key: string]: string | undefined;
    };
    metadata?: {
      venueId?: number;
      reservationCount?: number;
      productId?: string;
      categoryId?: string;
      rentalUnitId?: string;
      productIds?: string;
      applyFor?: string;
      minimumSpent?: number;
      usageLimitPerCoupon?: number;
      usageLimitPerCustomer?: number;
      couponUse?: number;
      userId?: string;
      selectedProduct?: string;
      product?: {
        id: number;
        title: string;
        price: number;
      };
      category?: {
        id: number;
        name: string;
      };
      rentalUnit?: {
        id: number;
        name: string;
      };
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
  
  export interface DiscountParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: boolean;
    type?: DiscountType;
  }
  
  export interface DiscountsResponse {
    data: Discount[];
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