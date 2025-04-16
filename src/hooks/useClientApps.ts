// src/hooks/useClientApps.ts

import { useState, useCallback, useMemo } from 'react';
import { createOmniStackClientApi } from '@/app/api/external/omnigateway/client';
import { 
  ClientAppParams,
  ClientAppWithClient
} from "@/app/api/external/omnigateway/types/client-apps";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useClientApps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientApps, setClientApps] = useState<ClientAppWithClient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackClientApi(apiKey) : null, [apiKey]);

  // Fetch client apps with optional filtering
  const fetchClientApps = useCallback(async (params: ClientAppParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getClientApps(params);
      
      const enhancedApps: ClientAppWithClient[] = response.data.map(app => ({
        ...app
      }));
      
      setClientApps(enhancedApps);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      return response;
    } catch (error) {
      toast.error('Failed to fetch client applications');
      console.error('Error fetching client apps:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);


  return {
    isLoading,
    clientApps,
    totalItems,
    totalPages,
    fetchClientApps,
    isInitialized: !!api
  };
};