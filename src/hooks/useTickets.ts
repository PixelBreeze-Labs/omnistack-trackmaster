// hooks/useTickets.ts

import { useState, useCallback, useMemo } from 'react';
import { createTicketsApi } from '@/app/api/external/omnigateway/tickets';
import { 
  Ticket,
  TicketParams,
  TicketStats,
  UpdateTicketDto,
  AddMessageDto
} from "@/app/api/external/omnigateway/types/tickets";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useTickets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    byPriority: {},
    byCategory: {}
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createTicketsApi(apiKey) : null, [apiKey]);

  // Fetch tickets with filtering
  const fetchTickets = useCallback(async (params: TicketParams = {}) => {
    if (!api) return;
    
    try {
      setIsLoading(true);
      const response = await api.getTickets(params);
      setTickets(response.tickets);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 20)));
      return response;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch ticket statistics
  const fetchTicketStats = useCallback(async () => {
    if (!api) return;
    
    try {
      const response = await api.getTicketStats();
      setStats(response);
      return response;
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      toast.error('Failed to fetch ticket statistics');
      throw error;
    }
  }, [api]);

  // Get a specific ticket
  const getTicket = useCallback(async (ticketId: string) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const response = await api.getTicket(ticketId);
      return response;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to fetch ticket details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Update a ticket
  const updateTicket = useCallback(async (ticketId: string, updateData: UpdateTicketDto) => {
    if (!api) return null;
    
    try {
      setIsUpdating(true);
      const response = await api.updateTicket(ticketId, updateData);
      
      // Update the ticket in the local state
      setTickets(prev => prev.map(ticket => 
        ticket._id === ticketId ? response : ticket
      ));
      
      toast.success('Ticket updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api]);

  // Add a message to a ticket
  const addMessage = useCallback(async (ticketId: string, messageData: AddMessageDto) => {
    if (!api) return null;
    
    try {
      setIsUpdating(true);
      const response = await api.addMessage(ticketId, messageData);
      
      // Update the ticket in the local state
      setTickets(prev => prev.map(ticket => 
        ticket._id === ticketId ? response : ticket
      ));
      
      toast.success('Message added successfully');
      return response;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to add message');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api]);

  // Delete a ticket
  const deleteTicket = useCallback(async (ticket: Ticket) => {
    if (!api) return false;
    
    try {
      setIsDeletingTicket(true);
      const response = await api.deleteTicket(ticket._id);
      
      if (response.success) {
        // Remove the ticket from local state
        setTickets(prev => prev.filter(t => t._id !== ticket._id));
        setTotalItems(prev => prev - 1);
        toast.success('Ticket deleted successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
      return false;
    } finally {
      setIsDeletingTicket(false);
    }
  }, [api]);

  // Quick status update
  const updateTicketStatus = useCallback(async (ticketId: string, status: UpdateTicketDto['status']) => {
    return updateTicket(ticketId, { status });
  }, [updateTicket]);

  // Quick priority update
  const updateTicketPriority = useCallback(async (ticketId: string, priority: UpdateTicketDto['priority']) => {
    return updateTicket(ticketId, { priority });
  }, [updateTicket]);

  // Quick assignment update
  const assignTicket = useCallback(async (ticketId: string, assignedTo: string, assignedToEmail?: string) => {
    return updateTicket(ticketId, { assignedTo, assignedToEmail });
  }, [updateTicket]);

  return {
    // State
    isLoading,
    isUpdating,
    isDeletingTicket,
    tickets,
    totalItems,
    totalPages,
    stats,
    
    // Methods
    fetchTickets,
    fetchTicketStats,
    getTicket,
    updateTicket,
    addMessage,
    deleteTicket,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    
    // Helper
    isInitialized: !!api
  };
};