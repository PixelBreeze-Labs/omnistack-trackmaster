import { useState, useCallback, useMemo } from 'react';
import { createCampaignsApi } from '@/app/api/external/omnigateway/paid-campaigns';
import {
  PaidCampaign,
  PaidCampaignStats,
  PaidListCampaignsResponse,
  ListPaidCampaignsDto,
  PaidCampaignDetailsResponse,
} from '@/app/api/external/omnigateway/types/paid-campaigns';
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const usePaidCampaigns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<PaidCampaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [overview, setOverview] = useState<PaidCampaignStats | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => (apiKey ? createCampaignsApi(apiKey) : null), [apiKey]);

  const fetchCampaigns = useCallback(
    async (params: ListPaidCampaignsDto = {}) => {
      if (!api) return;
      try {
        setIsLoading(true);
        const response: PaidListCampaignsResponse = await api.getCampaigns(params);
        setCampaigns(response.items);
        setTotalItems(response.total);
        setTotalPages(response.pages);
        return response;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to fetch campaigns');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const fetchOverview = useCallback(
    async (params: object = {}) => {
      if (!api) return;
      try {
        const data = await api.getCampaignOverview(params);
        setOverview(data);
        return data;
      } catch (error) {
        console.error('Error fetching campaign overview:', error);
        toast.error('Failed to fetch campaign overview');
        throw error;
      }
    },
    [api]
  );

  const fetchCampaignDetails = useCallback(
    async (id: string, params: object = {}) => {
      if (!api) return;
      try {
        setIsLoading(true);
        const data: PaidCampaignDetailsResponse = await api.getCampaignDetails(id, params);
        return data;
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.error('Failed to fetch campaign details');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  return {
    isLoading,
    campaigns,
    totalItems,
    totalPages,
    overview,
    fetchCampaigns,
    fetchOverview,
    fetchCampaignDetails,
  };
};
