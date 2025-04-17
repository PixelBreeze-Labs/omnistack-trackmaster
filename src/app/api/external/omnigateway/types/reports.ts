// src/app/api/external/omnigateway/types/reports.ts

export enum ReportStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    ARCHIVED = 'archived'
  }
  
  export interface FileAttachment {
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
    thumbnailUrl?: string;
  }
  
  export interface ReportContent {
    sender?: {
      name?: string;
      email?: string;
      phone?: string;
      ipAddress?: string;
    };
    message: string;
    files?: FileAttachment[];
  }
  
  export interface ReportClientApp {
    id: string;
    name: string;
    domain?: string[];
  }
  
  export interface ReportMetadata {
    timestamp: string;
    browser?: string;
    platform?: string;
    location?: {
      country?: string;
      city?: string;
      coordinates?: {
        lat: number;
        lng: number;
      }
    };
    userAgent?: string;
    referrer?: string;
    tags?: string[];
  }
  
  export interface Report {
    _id: string;
    clientApp: ReportClientApp;
    content: ReportContent;
    metadata: ReportMetadata;
    status: ReportStatus;
    assignedTo?: string;
    notes?: string;
    priority?: 'low' | 'medium' | 'high';
    lastUpdated?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ReportsSummary {
    total: number;
    byStatus: {
      pending: number;
      in_progress: number;
      resolved: number;
      closed: number;
      archived: number;
    };
    byPriority?: {
      low: number;
      medium: number;
      high: number;
    };
    recentActivity: {
      last24Hours: number;
      lastWeek: number;
      lastMonth: number;
    };
  }
  
  export interface ReportsResponse {
    data: Report[];
    total: number;
    message: string;
    summary?: ReportsSummary;
  }
  
  export interface ReportParams {
    page?: number;
    limit?: number;
    clientAppId?: string;
    status?: ReportStatus;
    search?: string;
    fromDate?: string;
    toDate?: string;
    priority?: string;
    skip?: number;
  }