// app/api/external/omnigateway/tickets.ts

import { createOmniGateway } from './index';
import { 
  Ticket, 
  TicketParams, 
  TicketsResponse, 
  TicketStats,
  UpdateTicketDto,
  AddMessageDto
} from './types/tickets';

export const createTicketsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all tickets for support team
    getTickets: async (params: TicketParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.category) queryParams.append('category', params.category);
      if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
      if (params.businessId) queryParams.append('businessId', params.businessId);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/tickets/support/all${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<TicketsResponse>(endpoint);
      return data;
    },

    // Get ticket statistics
    getTicketStats: async () => {
      const { data } = await api.get<TicketStats>('/tickets/support/stats');
      return data;
    },

    // Get a specific ticket
    getTicket: async (ticketId: string) => {
      const { data } = await api.get<Ticket>(`/tickets/support/${ticketId}`);
      return data;
    },

    // Update a ticket
    updateTicket: async (ticketId: string, updateData: UpdateTicketDto) => {
      const { data } = await api.put<Ticket>(`/tickets/support/${ticketId}`, updateData);
      return data;
    },

    // Add a message to a ticket
    addMessage: async (ticketId: string, messageData: AddMessageDto) => {
      const { data } = await api.post<Ticket>(`/tickets/support/${ticketId}/messages`, messageData);
      return data;
    },

    // Delete a ticket
    deleteTicket: async (ticketId: string) => {
      const { data } = await api.delete<{ success: boolean }>(`/tickets/support/${ticketId}`);
      return data;
    }
  };
};