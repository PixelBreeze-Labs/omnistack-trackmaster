// src/app/api/external/omnigateway/chat.ts
import { createOmniGateway } from './index';
import { Chat, ChatParams, ChatsResponse, SyncResponse } from './types/chats';

export const createOmniStackChatApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getChats: async (params: ChatParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);
      
      const queryString = queryParams.toString();
      const endpoint = `/chats${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<ChatsResponse>(endpoint);
      return data;
    },

    getChat: async (id: string) => {
      const { data } = await api.get<{ data: Chat }>(`/chats/${id}`);
      return data.data;
    },
    
    syncChats: async () => {
      const { data } = await api.post<SyncResponse>('/chats/sync');
      return data;
    },

    deleteChat: async (id: string) => {
      const { data } = await api.delete(`/chats/${id}`);
      return data;
    }
  };
};