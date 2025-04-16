// src/app/api/external/omnigateway/client.ts

import { createOmniGateway } from './index';
import { ClientParams, ClientsResponse, Client } from './types/clients';
import { ClientAppsResponse, ClientAppParams, ClientAppWithClient } from './types/client-apps';

export const createOmniStackClientApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Clients API
    getClients: async (params: ClientParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/clients${queryString ? `?${queryString}` : ''}`;
      
      try {
        const { data } = await api.get<ClientsResponse>(endpoint);
        
        // If response is an array, transform it to expected format
        if (Array.isArray(data)) {
          return {
            data: data,
            total: data.length,
            message: 'Success',
            metrics: {
              totalClients: data.length,
              activeClients: data.filter(client => client.isActive).length,
              inactiveClients: data.filter(client => !client.isActive).length,
              recentClients: data.filter(client => {
                const createdDate = new Date(client.createdAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return createdDate >= thirtyDaysAgo;
              }).length
            }
          };
        }
        
        // If the response already has the correct structure, just return it
        return data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
    },

    // Get a single client by ID
    getClient: async (id: string): Promise<Client> => {
      try {
        const { data } = await api.get<Client>(`/clients/${id}`);
        return data;
      } catch (error) {
        console.error(`Error fetching client ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new client
    createClient: async (clientData: Partial<Client>): Promise<Client> => {
      try {
        const { data } = await api.post<Client>('/clients', clientData);
        return data;
      } catch (error) {
        console.error('Error creating client:', error);
        throw error;
      }
    },
    
    // Update an existing client
    updateClient: async (id: string, clientData: Partial<Client>): Promise<Client> => {
      try {
        const { data } = await api.put<Client>(`/clients/${id}`, clientData);
        return data;
      } catch (error) {
        console.error(`Error updating client ${id}:`, error);
        throw error;
      }
    },
    
    // Delete a client
    deleteClient: async (id: string): Promise<void> => {
      try {
        await api.delete(`/clients/${id}`);
      } catch (error) {
        console.error(`Error deleting client ${id}:`, error);
        throw error;
      }
    },

    // Client Apps API
    getClientApps: async (params: ClientAppParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/client-apps${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<ClientAppsResponse>(endpoint);
      return data;
    },
    
    // Get a single client app by ID
    getClientApp: async (id: string): Promise<ClientAppWithClient> => {
      try {
        const { data } = await api.get<ClientAppWithClient>(`/client-apps/${id}`);
        return data;
      } catch (error) {
        console.error(`Error fetching client app ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new client app
    createClientApp: async (clientAppData: Partial<ClientAppWithClient>): Promise<ClientAppWithClient> => {
      try {
        const { data } = await api.post<ClientAppWithClient>('/client-apps', clientAppData);
        return data;
      } catch (error) {
        console.error('Error creating client app:', error);
        throw error;
      }
    },
    
    // Update an existing client app
    updateClientApp: async (id: string, clientAppData: Partial<ClientAppWithClient>): Promise<ClientAppWithClient> => {
      try {
        const { data } = await api.put<ClientAppWithClient>(`/client-apps/${id}`, clientAppData);
        return data;
      } catch (error) {
        console.error(`Error updating client app ${id}:`, error);
        throw error;
      }
    },
    
    // Delete a client app
    deleteClientApp: async (id: string): Promise<void> => {
      try {
        await api.delete(`/client-apps/${id}`);
      } catch (error) {
        console.error(`Error deleting client app ${id}:`, error);
        throw error;
      }
    }
  };
};