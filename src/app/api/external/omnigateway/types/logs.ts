// types/log.ts

export enum LogType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO'
  }
  
  export interface Log {
    _id: string;
    type: LogType;
    message: string;
    details?: any;
    sessionId: string;
    clientId?: string;
    imageId?: string;
    endpoint?: string;
    actionType?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateLogDto {
    type: LogType;
    message: string;
    details?: any;
    sessionId: string;
    clientId?: string;
    imageId?: string;
    endpoint?: string;
    actionType?: string;
  }
  
  export interface ListLogsParams {
    page?: number;
    limit?: number;
    type?: LogType;
    sessionId?: string;
    clientId?: string;
    actionType?: string;
    startDate?: Date | string;
    endDate?: Date | string;
  }
  
  export interface LogsResponse {
    items: Log[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }
  
  export interface StatDistribution {
    _id: string; // Either log type or action type
    count: number;
  }
  
  export interface LogStats {
    total: number;
    errorRate: number;
    byType: StatDistribution[];
    byAction: StatDistribution[];
  }