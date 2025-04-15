// src/hooks/useClients.ts

import { useState, useCallback, useMemo } from 'react';
import { createOmniStackClientApi } from '@/app/api/external/omnigateway/client';
import { 
  Client,
  ClientParams,
  ClientMetrics
} from "@/app/api/external/omnigateway/types/clients";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useClients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    recentClients: 0
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackClientApi(apiKey) : null, [apiKey]);

  // Fetch clients with optional filtering
  const fetchClients = useCallback(async (params: ClientParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getClients(params);
      
      // Debug output to see API response
      console.log('Client API response:', response);
      
      setClients(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      
      // Set metrics if they are returned from the API
      if (response.metrics) {
        setClientMetrics(response.metrics);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch clients');
      console.error('Error fetching clients:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    clients,
    totalItems,
    totalPages,
    clientMetrics,
    fetchClients,
    isInitialized: !!api
  };
};