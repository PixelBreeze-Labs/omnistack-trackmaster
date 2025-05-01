// src/hooks/useClientApps.ts

import { useState, useCallback, useMemo } from 'react';
import { createOmniStackClientApi } from '@/app/api/external/omnigateway/client';
import { 
  ClientAppParams,
  ClientApp,
  ClientAppMetrics,
  ClientAppBrandColors
} from "@/app/api/external/omnigateway/types/client-apps";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useClientApps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientApps, setClientApps] = useState<ClientApp[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [clientAppMetrics, setClientAppMetrics] = useState<ClientAppMetrics>({
    totalApps: 0,
    activeApps: 0,
    inactiveApps: 0,
    recentApps: 0
  });

  // Add this to the existing useClientApps hook
const [dashboardData, setDashboardData] = useState({
  metrics: {
    totalApps: 0,
    activeApps: 0,
    inactiveApps: 0,
    recentApps: 0,
    appsByType: []
  },
  recentApps: [],
  clientsWithMostApps: []
});
const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackClientApi(apiKey) : null, [apiKey]);

  // Fetch client apps with optional filtering
  const fetchClientApps = useCallback(async (params: ClientAppParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getClientApps(params);
      
      setClientApps(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      
      // Set metrics if they are returned from the API
      if (response.metrics) {
        setClientAppMetrics(response.metrics);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching client apps:', error);
      
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to fetch client applications');
      }
      
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
      const clientApp = await api.getClientApp(id);
      return clientApp;
    } catch (error) {
      console.error('Error fetching client app details:', error);
      
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to fetch client app details');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Create a new client app
  const createClientApp = useCallback(async (clientAppData: Partial<ClientApp>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      console.log('Creating client app with data:', clientAppData);
      
      // Ensure domain is always sent as an array
      if (clientAppData.domain && !Array.isArray(clientAppData.domain)) {
        clientAppData.domain = [clientAppData.domain as string];
      }
      
      const newClientApp = await api.createClientApp(clientAppData);
      
      // Update local state to add the new client app
      setClientApps(currentApps => [newClientApp, ...currentApps]);
      setTotalItems(prev => prev + 1);
      
      return newClientApp;
    } catch (error) {
      console.error('Error creating client app:', error);
      
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to create client application');
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Update a client app
  const updateClientApp = useCallback(async (id: string, clientAppData: Partial<ClientApp>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      console.log('Updating client app with data:', clientAppData);
      
      // Ensure domain is always sent as an array if it's included
      if (clientAppData.domain && !Array.isArray(clientAppData.domain)) {
        clientAppData.domain = [clientAppData.domain as string];
      }
      
      const updatedClientApp = await api.updateClientApp(id, clientAppData);
      
      // Update local state to reflect changes
      setClientApps(currentApps => 
        currentApps.map(app => 
          app._id === id ? updatedClientApp : app
        )
      );
      
      return updatedClientApp;
    } catch (error) {
      console.error('Error updating client app:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please check your API key or login again.');
      } else if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to update client application');
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Update brand colors for a client app
  const updateBrandColors = useCallback(async (id: string, brandColors: ClientAppBrandColors) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      console.log('Updating brand colors for client app with ID:', id, brandColors);
      
      // We can use the updateClientApp method with brandColors property
      const updatedClientApp = await api.updateClientApp(id, { brandColors });
      
      // Update local state to reflect changes
      setClientApps(currentApps => 
        currentApps.map(app => 
          app._id === id ? updatedClientApp : app
        )
      );
      
      return updatedClientApp;
    } catch (error) {
      console.error('Error updating brand colors:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please check your API key or login again.');
      } else if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to update brand colors');
      }
      
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
      console.log('Deleting client app with ID:', id);
      
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
      
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please check your API key or login again.');
      } else if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to delete client application');
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  const fetchDashboardData = useCallback(async () => {
    if (!api) return;
    
    try {
      setIsDashboardLoading(true);
      const response = await api.getDashboardData();
      console.log('Dashboard data response:', response);
      setDashboardData(response);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to fetch dashboard data');
      }
      throw error;
    } finally {
      setIsDashboardLoading(false);
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
    dashboardData,
    isDashboardLoading,
    fetchDashboardData,
    isInitialized: !!api
  };
};