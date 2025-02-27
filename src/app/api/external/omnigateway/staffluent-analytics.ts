// app/api/external/omnigateway/staffluent-analytics.ts
import { createOmniGateway } from './index';
import { BusinessAnalyticsResponse, UserAnalyticsResponse } from './types/staffluent-analytics';

export const createAnalyticsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get business analytics data
    getBusinessAnalytics: async (period?: string) => {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      
      const queryString = params.toString();
      const endpoint = `/staffluent-analytics/businesses${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<BusinessAnalyticsResponse>(endpoint);
      return data;
    },
    
    // Get user analytics data
    getUserAnalytics: async (period?: string) => {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      
      const queryString = params.toString();
      const endpoint = `/staffluent-analytics/users${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<UserAnalyticsResponse>(endpoint);
      return data;
    }
  };
};