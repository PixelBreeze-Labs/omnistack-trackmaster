// hooks/useStaffluentAnalytics.ts
import { useState, useCallback, useMemo } from 'react';
import { createAnalyticsApi } from '@/app/api/external/omnigateway/stafflient-analytics';
import { 
  BusinessAnalyticsResponse, 
  UserAnalyticsResponse 
} from '@/app/api/external/omnigateway/types/staffluent-analytics';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [businessAnalytics, setBusinessAnalytics] = useState<BusinessAnalyticsResponse | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsResponse | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createAnalyticsApi(apiKey) : null, [apiKey]);

  // Fetch business analytics data
  const fetchBusinessAnalytics = useCallback(async (period?: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBusinessAnalytics(period);
      setBusinessAnalytics(response);
      return response;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      toast.error('Failed to load business analytics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch user analytics data
  const fetchUserAnalytics = useCallback(async (period?: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getUserAnalytics(period);
      setUserAnalytics(response);
      return response;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      toast.error('Failed to load user analytics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch all analytics data
  const fetchAllAnalytics = useCallback(async (period?: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const [businessData, userData] = await Promise.all([
        api.getBusinessAnalytics(period),
        api.getUserAnalytics(period)
      ]);
      
      setBusinessAnalytics(businessData);
      setUserAnalytics(userData);
      
      return { businessAnalytics: businessData, userAnalytics: userData };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    businessAnalytics,
    userAnalytics,
    fetchBusinessAnalytics,
    fetchUserAnalytics,
    fetchAllAnalytics,
    isInitialized: !!api
  };
};