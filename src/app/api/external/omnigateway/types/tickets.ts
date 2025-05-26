// app/api/external/omnigateway/types/tickets.ts

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    DUPLICATE = 'duplicate'
  }
  
  export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
  }
  
  export enum TicketCategory {
    TECHNICAL = 'technical',
    BILLING = 'billing',
    FEATURE_REQUEST = 'feature_request',
    BUG = 'bug',
    ACCOUNT = 'account',
    TRAINING = 'training',
    OTHER = 'other'
  }
  
  export interface TicketMessage {
    _id?: string;
    sender: 'business' | 'support';
    senderName: string;
    senderEmail: string;
    message: string;
    attachments: string[];
    timestamp: string;
    metadata: Record<string, any>;
  }
  
  export interface Ticket {
    _id: string;
    businessId: string;
    clientId: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    createdByName: string;
    createdByEmail: string;
    createdByUserId?: string;
    assignedTo?: string;
    assignedToEmail?: string;
    tags: string[];
    messages: TicketMessage[];
    duplicateOf?: string;
    resolutionNotes?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string;
    notificationIds?: string[];
    metadata: Record<string, any>;
    // Populated fields
    business?: {
      _id: string;
      name: string;
      email: string;
    };
  }
  
  export interface CreateTicketDto {
    title: string;
    description: string;
    priority?: TicketPriority;
    category?: TicketCategory;
    createdByName: string;
    createdByEmail: string;
    createdByUserId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }
  
  export interface AddMessageDto {
    message: string;
    senderName: string;
    senderEmail: string;
    attachments?: string[];
    metadata?: Record<string, any>;
  }
  
  export interface UpdateTicketDto {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
    assignedToEmail?: string;
    tags?: string[];
    duplicateOf?: string;
    resolutionNotes?: string;
  }
  
  export interface TicketParams {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
    search?: string;
    businessId?: string;
    fromDate?: string;
    toDate?: string;
  }
  
  export interface TicketsResponse {
    tickets: Ticket[];
    total: number;
    page: number;
    limit: number;
    success: boolean;
  }
  
  export interface TicketStats {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  }