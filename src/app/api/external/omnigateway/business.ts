// app/api/external/omnigateway/business.ts
import { createOmniGateway } from './index';
import { 
  BusinessParams, 
  BusinessesResponse,
} from './types/business';

export const createBusinessApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all businesses with optional filtering
    getBusinesses: async (params: BusinessParams = {}): Promise<BusinessesResponse> => {
      const { data } = await api.get('/businesses', { params });
      return data;
    },
    
    // Get trial businesses (convenience method that sets isTrialing=true)
    getTrialBusinesses: async (params: Omit<BusinessParams, 'isTrialing'> = {}): Promise<BusinessesResponse> => {
      const { data } = await api.get('/businesses', { 
        params: { 
          ...params, 
          isTrialing: true,
          status: 'trialing'
        } 
      });
      return data;
    },
    
    
  };
};