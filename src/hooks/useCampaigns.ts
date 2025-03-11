// src/hooks/useCampaigns.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackCampaignApi } from '@/app/api/external/omnigateway/campaign';
import { 
  Campaign,
  CampaignParams,
} from "@/app/api/external/omnigateway/types/campaigns";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCampaigns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackCampaignApi(apiKey) : null, [apiKey]);

  // Fetch campaigns with optional filtering
  const fetchCampaigns = useCallback(async (params: CampaignParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getCampaigns(params);
      setCampaigns(response.data);
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch campaigns');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single campaign by ID
  const getCampaign = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const campaign = await api.getCampaign(id);
      return campaign;
    } catch (error) {
      toast.error('Failed to fetch campaign details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Sync campaigns from VenueBoost
  const syncCampaigns = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.syncCampaigns();
      return response;
    } catch (error) {
      toast.error('Failed to sync campaigns');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Delete a campaign
  const deleteCampaign = useCallback(async (campaign: Campaign) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsDeletingCampaign(true);
      await api.deleteCampaign(campaign.id);
      
      // Remove campaign from the local state to update UI
      setCampaigns(currentCampaigns => 
        currentCampaigns.filter(c => c.id !== campaign.id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete campaign');
      }
      
      throw error;
    } finally {
      setIsDeletingCampaign(false);
    }
  }, [api]);

  return {
    isLoading,
    isDeletingCampaign,
    campaigns,
    totalItems,
    totalPages,
    fetchCampaigns,
    getCampaign,
    syncCampaigns,
    deleteCampaign,
    isInitialized: !!api
  };
};