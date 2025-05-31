// Entity types for generated images
export enum EntityType {
    ICONSTYLE = 'iconstyle',
    GAZETAREFORMA = 'reforma',
    OTHER = 'other'
  }
  
  // Base generated image type
  export interface GeneratedImage {
    id: string;
    path: string;
    generationTime: Date;
    downloadTime?: Date;
    sessionId: string;
    templateType: string;
    subtitle?: string;
    entity: EntityType;
    clientId: string;
    articleUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // DTO for creating a new generated image
  export interface CreateGeneratedImageDto {
    path: string;
    sessionId: string;
    templateType: string;
    subtitle?: string;
    entity: EntityType;
    articleUrl?: string;
  }
  
  // Parameters for listing/filtering generated images
  export interface ListGeneratedImagesParams {
    page?: number;
    limit?: number;
    entity?: EntityType;
    templateType?: string;
  }
  
  // Response format for paginated generated images
  export interface GeneratedImagesResponse {
    items: GeneratedImage[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }
  
  // Stats about generated images
  export interface GeneratedImageStats {
    total: number;
    downloadRate: number;
    byEntity: {
      _id: string;
      count: number;
    }[];
    byTemplate: {
      _id: string;
      count: number;
    }[];
  }
  
  // Log types
  export enum LogType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING'
  }
  
  // Log entry interface
  export interface LogEntry {
    id: string;
    type: LogType;
    message: string;
    details?: any;
    sessionId: string;
    clientId?: string;
    imageId?: string;
    endpoint?: string;
    actionType?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Response format for paginated logs
  export interface LogsResponse {
    items: LogEntry[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }
  
  // Log statistics
  export interface LogStats {
    total: number;
    errorRate: number;
    byType: {
      _id: string;
      count: number;
    }[];
    byAction: {
      _id: string;
      count: number;
    }[];
  }


  export interface StatDistribution {
    _id: string; // Either entity name or template type
    count: number;
  }
  
  export interface TemplateStats {
    total: number;
    downloadRate: number;
    byEntity: StatDistribution[];
  }