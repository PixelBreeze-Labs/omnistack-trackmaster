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

  // Get business details by ID
  const getBusinessDetails = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBusinessDetails(businessId);
      return response;
    } catch (error) {
      toast.error('Failed to fetch business details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

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
      toast.error('Failed to fetch trial businesses');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

    // Update business details
    const updateBusiness = useCallback(async (businessId: string, updateData: any) => {
      if (!api) return null;
      
      setIsLoading(true);
      try {
        const response = await api.updateBusiness(businessId, updateData);
        
        if (response && response.success) {
          toast.success(response.message || "Business updated successfully");
        }
        
        return response;
      } catch (error) {
        console.error("Error updating business:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update business");
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [api]);

    
  // Deactivate a business
  const deactivateBusiness = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.deactivateBusiness(businessId);
      toast.success('Business deactivated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to deactivate business');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Activate a business
  const activateBusiness = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.activateBusiness(businessId);
      toast.success('Business activated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to activate business');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Toggle test account status
  const toggleTestAccountStatus = useCallback(async (businessId: string, isTestAccount: boolean) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateTestAccountStatus(businessId, isTestAccount);
      toast.success(isTestAccount 
        ? "Business marked as test account" 
        : "Business unmarked as test account");
      return response;
    } catch (error) {
      toast.error('Failed to update test account status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Soft delete a business
  const softDeleteBusiness = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.softDeleteBusiness(businessId);
      toast.success('Business deleted successfully');
      return response;
    } catch (error) {
      toast.error('Failed to delete business');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.sendMagicLink(email);
      toast.success('Magic link sent successfully');
      return response;
    } catch (error) {
      toast.error('Failed to send magic link');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const getBusinessEmployees = useCallback(async (
  businessId: string,
  params = {}
) => {
  if (!api) return null;
  
  try {
    setIsLoading(true);
    const response = await api.getBusinessEmployees(businessId, params);
    return response;
  } catch (error) {
    console.error("Error fetching business employees:", error);
    toast.error("Failed to fetch employees");
    return null;
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
    getBusinessDetails,
    fetchBusinesses,
    fetchTrialBusinesses,
    deactivateBusiness,
    activateBusiness,
    toggleTestAccountStatus,
    softDeleteBusiness,
    sendMagicLink,
    getBusinessEmployees,
    updateBusiness,
    isInitialized: !!api
  };
};