// app/api/external/omnigateway/subscription.ts
import { createOmniGateway } from './index';
import { ProductParams, SyncProductsResponse } from './types/stripe-products';

export const createSubscriptionApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get products with their prices from our database 
    getProducts: async (params: ProductParams = {}) => {
      const { data } = await api.get('/subscriptions/products', { params });
      return data;
    },
    
    // Sync products and prices from Stripe to our database
    syncProducts: async (): Promise<SyncProductsResponse> => {
      const { data } = await api.post('/subscriptions/sync');
      return data;
    }
  };
};