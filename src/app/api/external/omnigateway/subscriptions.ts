import { createOmniGateway } from './index';

export const createSubscriptionsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all subscriptions with optional filtering
    getSubscriptions: async (params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}) => {
      const { data } = await api.get('/subscriptions', { params });
      return data;
    },
    
    // Get active subscriptions
    getActiveSubscriptions: async (params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}) => {
      const { data } = await api.get('/subscriptions', { 
        params: { 
          ...params,
          status: 'active'
        } 
      });
      return data;
    },
    
    // Get past due subscriptions
    getPastDueSubscriptions: async (params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}) => {
      const { data } = await api.get('/subscriptions', { 
        params: { 
          ...params,
          status: 'past_due'
        } 
      });
      return data;
    },
    
    // Get canceled subscriptions
    getCanceledSubscriptions: async (params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}) => {
      const { data } = await api.get('/subscriptions', { 
        params: { 
          ...params,
          status: 'canceled'
        } 
      });
      return data;
    },
    
    // Get subscription details
    getSubscriptionDetails: async (subscriptionId: string) => {
      const { data } = await api.get(`/subscriptions/${subscriptionId}`);
      return data;
    },
    
    // Update subscription
    updateSubscription: async (subscriptionId: string, updateData: any) => {
      const { data } = await api.put(`/subscriptions/${subscriptionId}`, updateData);
      return data;
    },
    
    // Cancel subscription
    cancelSubscription: async (subscriptionId: string, cancelData: {
      cancelAtPeriodEnd?: boolean;
      reason?: string;
    } = {}) => {
      const { data } = await api.post(`/subscriptions/${subscriptionId}/cancel`, cancelData);
      return data;
    }
  };
};