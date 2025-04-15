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
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Get a single client by ID
  const getClient = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const client = await api.getClient(id);
      return client;
    } catch (error) {
      toast.error('Failed to fetch client details');
      console.error('Error fetching client details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Create a new client
  const createClient = useCallback(async (clientData: Partial<Client>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      const newClient = await api.createClient(clientData);
      
      // Update local state to add the new client
      setClients(currentClients => [newClient, ...currentClients]);
      setTotalItems(prev => prev + 1);
      
      return newClient;
    } catch (error) {
      toast.error('Failed to create client');
      console.error('Error creating client:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Update a client
  const updateClient = useCallback(async (id: string, clientData: Partial<Client>) => {
    if (!api) return;
    try {
      setIsProcessing(true);
      const updatedClient = await api.updateClient(id, clientData);
      
      // Update local state to reflect changes
      setClients(currentClients => 
        currentClients.map(client => 
          client._id === id ? updatedClient : client
        )
      );
      
      return updatedClient;
    } catch (error) {
      toast.error('Failed to update client');
      console.error('Error updating client:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Delete a client
  const deleteClient = useCallback(async (id: string) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsProcessing(true);
      await api.deleteClient(id);
      
      // Update local state to remove deleted client
      setClients(currentClients => 
        currentClients.filter(client => client._id !== id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete client');
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  return {
    isLoading,
    isProcessing,
    clients,
    totalItems,
    totalPages,
    clientMetrics,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    isInitialized: !!api
  };
};