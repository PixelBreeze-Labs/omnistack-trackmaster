import { createOmniGateway } from './index';
import { 
  Log,
  CreateLogDto,
  LogsResponse,
  LogStats,
  ListLogsParams
} from './types/logs';

// Create axios instance with base configuration
export const createLogApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {


    // Get all logs with filtering and pagination
    getLogs: async (params: ListLogsParams = {}): Promise<LogsResponse> => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.type) queryParams.append('type', params.type);
      if (params.sessionId) queryParams.append('sessionId', params.sessionId);
      if (params.actionType) queryParams.append('actionType', params.actionType);
      
      if (params.startDate) {
        queryParams.append('startDate', new Date(params.startDate).toISOString());
      }
      
      if (params.endDate) {
        queryParams.append('endDate', new Date(params.endDate).toISOString());
      }
      
      const queryString = queryParams.toString();
      const endpoint = `/logs${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Get logs for a specific session
    getSessionLogs: async (sessionId: string): Promise<Log[]> => {
      const { data } = await api.get(`/logs/session/${sessionId}`);
      return data;
    },

    // Get log statistics
getLogStats: async (): Promise<LogStats> => {
    try {
      const { data } = await api.get('/logs/stats');
      return data;
    } catch (error) {
      console.error('Error fetching log stats:', error);
      // Return default values to prevent null reference errors
      return {
        total: 0,
        errorRate: 0,
        byType: [],
        byAction: []
      };
    }
  },

    // Admin function to clear old logs
    clearOldLogs: async (daysToKeep: number = 30): Promise<{ message: string, deletedCount: number }> => {
      const { data } = await api.delete(`/logs/clear/${daysToKeep}`);
      return data;
    }
  };
};