// hooks/useAdminSubscription.ts
import { useState, useCallback, useMemo } from 'react';
import { createAdminSubscriptionApi } from '@/app/api/external/omnigateway/admin-subscription';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';

export const useAdminSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createAdminSubscriptionApi(apiKey) : null, [apiKey]);

  // Register and subscribe a business in one call (admin only)
  const registerAndSubscribeBusiness = useCallback(async (data: any) => {
    if (!api) {
      throw new Error('API not initialized');
    }
    
    try {
      setIsLoading(true);
      const response = await api.registerAndSubscribeBusiness(data);
      return response;
    } catch (error: any) {
      console.error('Error registering business:', error);
      
      // Get the error message from the API response if available
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register business';
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    registerAndSubscribeBusiness,
    isInitialized: !!api
  };
};