// src/app/api/external/omnigateway/campaign.ts
import { createOmniGateway } from './index';
import { Campaign, CampaignParams, CampaignsResponse, SyncResponse } from './types/campaigns';

export const createOmniStackCampaignApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getCampaigns: async (params: CampaignParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);
      if (params.sent !== undefined) queryParams.append('sent', params.sent.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/campaigns${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<CampaignsResponse>(endpoint);
      return data;
    },

    getCampaign: async (id: string) => {
      const { data } = await api.get<{ data: Campaign }>(`/campaigns/${id}`);
      return data.data;
    },
    
    syncCampaigns: async () => {
      const { data } = await api.post<SyncResponse>('/campaigns/sync');
      return data;
    },

    deleteCampaign: async (id: string) => {
      const { data } = await api.delete(`/campaigns/${id}`);
      return data;
    }
  };
};