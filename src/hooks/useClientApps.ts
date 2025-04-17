// src/hooks/useClientApps.ts

import { useState, useCallback, useMemo } from 'react';
import { createOmniStackClientApi } from '@/app/api/external/omnigateway/client';
import { 
  ClientAppParams,
  ClientAppWithClient,
  ClientAppMetrics
} from "@/app/api/external/omnigateway/types/client-apps";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useClientApps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientApps, setClientApps] = useState<ClientAppWithClient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [clientAppMetrics, setClientAppMetrics] = useState<ClientAppMetrics>({
    totalApps: 0,
    activeApps: 0,
    inactiveApps: 0,
    recentApps: 0
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackClientApi(apiKey) : null, [apiKey]);

  // Fetch client apps with optional filtering
  const fetchClientApps = useCallback(async (params: ClientAppParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getClientApps(params);
      
      console.log('Client Apps API response:', response);
      
      setClientApps(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      
      // Set metrics if they are returned from the API
      if (response.metrics) {
        setClientAppMetrics(response.metrics);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch client applications');
      console.error('Error fetching client apps:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single client app by ID
  const getClientApp = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      // Assuming there's a getClientApp method in the API
      const clientApp = await api.getClientApp(id);
      return clientApp;
    } catch (error) {
      toast.error('Failed to fetch client app details');
      console.error('Error fetching client app details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Create a new client app
  const createClientApp = useCallback(async (clientAppData: Partial<ClientAppWithClient>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      // Assuming there's a createClientApp method in the API
      const newClientApp = await api.createClientApp(clientAppData);
      
      // Update local state to add the new client app
      setClientApps(currentApps => [newClientApp, ...currentApps]);
      setTotalItems(prev => prev + 1);
      
      return newClientApp;
    } catch (error) {
      toast.error('Failed to create client application');
      console.error('Error creating client app:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Update a client app
  const updateClientApp = useCallback(async (id: string, clientAppData: Partial<ClientAppWithClient>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      // Assuming there's an updateClientApp method in the API
      const updatedClientApp = await api.updateClientApp(id, clientAppData);
      
      // Update local state to reflect changes
      setClientApps(currentApps => 
        currentApps.map(app => 
          app._id === id ? updatedClientApp : app
        )
      );
      
      return updatedClientApp;
    } catch (error) {
      toast.error('Failed to update client application');
      console.error('Error updating client app:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Delete a client app
  const deleteClientApp = useCallback(async (id: string) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsProcessing(true);
      // Assuming there's a deleteClientApp method in the API
      await api.deleteClientApp(id);
      
      // Update local state to remove deleted client app
      setClientApps(currentApps => 
        currentApps.filter(app => app._id !== id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting client app:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete client application');
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  return {
    isLoading,
    isProcessing,
    clientApps,
    totalItems,
    totalPages,
    clientAppMetrics,
    fetchClientApps,
    getClientApp,
    createClientApp,
    updateClientApp,
    deleteClientApp,
    isInitialized: !!api
  };
};