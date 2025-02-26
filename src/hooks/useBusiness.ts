// hooks/useBusiness.ts
import { useState, useCallback, useMemo } from 'react';
import { createBusinessApi } from '@/app/api/external/omnigateway/business';
import { 
  Business,
  BusinessMetrics, 
  BusinessParams,
} from "@/app/api/external/omnigateway/types/business";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useBusiness = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    trialBusinesses: 0,
    businessesByStatus: {
      active: 0,
      trialing: 0,
      pastDue: 0,
      canceled: 0,
      incomplete: 0,
    },
    trends: {
      newBusinesses: { value: 0, percentage: 0 },
      churnRate: { value: 0, percentage: 0 }
    }
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createBusinessApi(apiKey) : null, [apiKey]);

  // Fetch all businesses with optional filtering
  const fetchBusinesses = useCallback(async (params: BusinessParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBusinesses(params);
      setBusinesses(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to fetch businesses');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch trial businesses only
  const fetchTrialBusinesses = useCallback(async (params: Omit<BusinessParams, 'isTrialing'> = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getTrialBusinesses(params);
      setBusinesses(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching trial businesses:', error);
      toast.error('Failed to fetch trial businesses');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);


  const deactivateBusiness = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.deactivateBusiness(businessId);
      toast({
        title: "Success",
        description: "Business deactivated successfully"
      });
      return response;
    } catch (error) {
      console.error('Error deactivating business:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate business",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);
  
  // Activate a business
  const activateBusiness = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.activateBusiness(businessId);
      toast({
        title: "Success",
        description: "Business activated successfully"
      });
      return response;
    } catch (error) {
      console.error('Error activating business:', error);
      toast({
        title: "Error",
        description: "Failed to activate business",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);
  
  // Toggle test account status
  const toggleTestAccountStatus = useCallback(async (businessId: string, isTestAccount: boolean) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateTestAccountStatus(businessId, isTestAccount);
      toast({
        title: "Success",
        description: isTestAccount 
          ? "Business marked as test account" 
          : "Business unmarked as test account"
      });
      return response;
    } catch (error) {
      console.error('Error updating test account status:', error);
      toast({
        title: "Error",
        description: "Failed to update test account status",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  return {
    isLoading,
    businesses,
    totalItems,
    totalPages,
    metrics,
    fetchBusinesses,
    fetchTrialBusinesses,
    deactivateBusiness,
    activateBusiness,
    toggleTestAccountStatus,
    isInitialized: !!api
  };
};