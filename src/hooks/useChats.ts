// src/hooks/useChats.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackChatApi } from '@/app/api/external/omnigateway/chat';
import { 
  Chat,
  ChatParams,
} from "@/app/api/external/omnigateway/types/chats";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useChats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackChatApi(apiKey) : null, [apiKey]);

  // Fetch chats with optional filtering
  const fetchChats = useCallback(async (params: ChatParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getChats(params);
      setChats(response.data);
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch chats');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single chat by ID
  const getChat = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const chat = await api.getChat(id);
      return chat;
    } catch (error) {
      toast.error('Failed to fetch chat details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Sync chats from VenueBoost
  const syncChats = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.syncChats();
      return response;
    } catch (error) {
      toast.error('Failed to sync chats');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Delete a chat
  const deleteChat = useCallback(async (chat: Chat) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsDeletingChat(true);
      await api.deleteChat(chat.id);
      
      // Remove chat from the local state to update UI
      setChats(currentChats => 
        currentChats.filter(c => c.id !== chat.id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete chat');
      }
      
      throw error;
    } finally {
      setIsDeletingChat(false);
    }
  }, [api]);

  return {
    isLoading,
    isDeletingChat,
    chats,
    totalItems,
    totalPages,
    fetchChats,
    getChat,
    syncChats,
    deleteChat,
    isInitialized: !!api
  };
};