import { createOmniGateway } from './index';
import {
  ListPaidCampaignsDto,
  PaidCampaignParamsDto,
} from './types/paid-campaigns';

export const createCampaignsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getCampaignOverview: async (params: object = {}) => {
      const { data } = await api.get('/tracking/campaigns/overview', { params });
      return data;
    },
    getCampaigns: async (params: ListPaidCampaignsDto = {}) => {
      const { data } = await api.get('/tracking/campaigns', { params });
      return data;
    },
    getCampaignDetails: async (id: string, params: object = {}) => {
      const { data } = await api.get(`/tracking/campaigns/${id}`, { params });
      return data;
    },
    createCampaign: async (data: PaidCampaignParamsDto) => {
      const { data: response } = await api.post('/tracking/campaigns', data);
      return response;
    },
  };
};
