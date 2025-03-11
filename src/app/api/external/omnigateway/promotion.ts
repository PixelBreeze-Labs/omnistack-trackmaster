// src/app/api/external/omnigateway/promotion.ts
import { createOmniGateway } from './index';
import { 
  Promotion, 
  PromotionParams, 
  PromotionsResponse, 
  Discount, 
  DiscountParams, 
  DiscountsResponse, 
  SyncResponse 
} from './types/promotions';

export const createOmniStackPromotionApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Promotions endpoints
    getPromotions: async (params: PromotionParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status !== undefined) queryParams.append('status', params.status ? 'true' : 'false');
      if (params.type) queryParams.append('type', params.type);
      
      const queryString = queryParams.toString();
      const endpoint = `/promotions${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<PromotionsResponse>(endpoint);
      return data;
    },

    getPromotion: async (id: string) => {
      const { data } = await api.get<{ data: Promotion }>(`/promotions/${id}`);
      return data.data;
    },
    
    syncPromotions: async () => {
      const { data } = await api.post<SyncResponse>('/promotions/sync');
      return data;
    },

    deletePromotion: async (id: string) => {
      const { data } = await api.delete(`/promotions/${id}`);
      return data;
    },

    // Discounts endpoints
    getDiscounts: async (params: DiscountParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status !== undefined) queryParams.append('status', params.status ? 'true' : 'false');
      if (params.type) queryParams.append('type', params.type);
      
      const queryString = queryParams.toString();
      const endpoint = `/discounts${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<DiscountsResponse>(endpoint);
      return data;
    },

    getDiscount: async (id: string) => {
      const { data } = await api.get<{ data: Discount }>(`/discounts/${id}`);
      return data.data;
    },
    
    syncDiscounts: async () => {
      const { data } = await api.post<SyncResponse>('/discounts/sync');
      return data;
    },

    deleteDiscount: async (id: string) => {
      const { data } = await api.delete(`/discounts/${id}`);
      return data;
    }
  };
};