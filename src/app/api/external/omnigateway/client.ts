// src/app/api/external/omnigateway/client.ts

import { createOmniGateway } from './index';
import { ClientParams, ClientsResponse, Client } from './types/clients';
import { ClientAppsResponse, ClientAppParams } from './types/client-apps';

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
    

  };
};