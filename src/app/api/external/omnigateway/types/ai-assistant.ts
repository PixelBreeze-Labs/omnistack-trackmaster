// app/api/external/omnigateway/types/ai-assistant.ts

export enum AssistantType {
    CUSTOMER = 'customer',
    SALES = 'sales',
    PRODUCT = 'product',
    MARKETING = 'marketing',
    ANALYTICS = 'analytics',
    ADMIN = 'admin'
};

export interface AIQueryContext {
    assistantType: AssistantType;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    productId?: string;
    categoryId?: string;
    searchTerm?: string;
}

export interface AIQueryResponse {
    answer: string;
    data: any;
    suggestions: string[];
    relatedQueries: string[];
}