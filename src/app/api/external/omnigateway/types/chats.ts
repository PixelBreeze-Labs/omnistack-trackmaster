// src/app/api/external/omnigateway/types/chats.ts
export enum ChatStatus {
    ACTIVE = 'active',
    ARCHIVED = 'archived',
    DELETED = 'deleted'
  }
  
  export enum ChatType {
    ORDER = 'order',
    BOOKING = 'booking',
    STAFF = 'staff',
    CLIENT = 'client'
  }
  
  export interface ChatLastMessage {
    content: string;
    type: string;
    senderId: string;
    createdAt: string;
  }
  
  export interface Chat {
    id: string;
    clientId: string;
    endUserName: string;
    endUserEmail: string;
    bookingId?: string;
    status: ChatStatus;
    type: ChatType;
    messageCount: number;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    lastMessage?: ChatLastMessage;
    externalIds: {
      venueboostId?: string;
      [key: string]: string | undefined;
    };
    metadata?: {
      endUserId?: string;
      venueUserId?: string;
      venueId?: string;
      vbBookingId?: string;
      [key: string]: any;
    };
  }
  
  export interface ChatParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: ChatStatus;
    type?: ChatType;
  }
  
  export interface ChatsResponse {
    data: Chat[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }
  
  export interface SyncResponse {
    success: boolean;
    message: string;
    created: number;
    updated: number;
    unchanged: number;
    errors: number;
  }