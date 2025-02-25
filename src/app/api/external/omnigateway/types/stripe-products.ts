// types/stripe-products.ts
export interface StripeProduct {
    _id: string;
    name: string;
    description?: string;
    stripeProductId: string;
    clientId: string;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    prices?: StripePrice[];
}

export interface StripePrice {
    _id: string;
    stripeProductId: string;
    clientId: string;
    stripePriceId: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    intervalCount: number;
    trialPeriodDays?: number;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export type CreateProductDto = {
    name: string;
    description?: string;
    stripeProductId?: string;
    isActive?: boolean;
    metadata?: Record<string, any>;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export type CreatePriceDto = {
    stripeProductId: string;
    stripePriceId?: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    intervalCount?: number;
    trialPeriodDays?: number;
    isActive?: boolean;
    metadata?: Record<string, any>;
}

export type UpdatePriceDto = Partial<CreatePriceDto>;

export interface ProductParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'all';
}

export interface ProductMetrics {
    totalProducts: number;
    activeProducts: number;
    totalPrices: number;
    activePrices: number;
    trends: {
        products: { value: number; percentage: number; };
        prices: { value: number; percentage: number; };
    };
}

export interface ProductsResponse {
    items: StripeProduct[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    metrics: ProductMetrics;
}

export interface SyncProductsResponse {
    success: boolean;
    productsCount: number;
    pricesCount: number;
}