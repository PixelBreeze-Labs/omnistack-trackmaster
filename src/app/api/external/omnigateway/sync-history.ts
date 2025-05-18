// app/api/external/omnigateway/sync-history.ts
import { createOmniGateway } from './index';
import {
  CronJobHistoryResponse,
  CronJobStats,
  TaskStats,
  EmployeeStats,
  AutoAssignStats,
  BusinessDetailsResponse,
  WeatherMonitoringStats
} from './types/cron-history';

export const createSyncHistoryApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get cron job history with pagination and filters
    getCronJobHistory: async (params: {
      page?: number;
      limit?: number;
      status?: 'completed' | 'failed' | 'started';
      jobName?: string;
      businessId?: string;
    } = {}): Promise<CronJobHistoryResponse> => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.jobName) queryParams.append('jobName', params.jobName);
      if (params.businessId) queryParams.append('businessId', params.businessId);
      
      const queryString = queryParams.toString();
      const endpoint = `/staffluent-superadmin/cron-history${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Get cron job statistics
    getCronJobStats: async (days?: number): Promise<CronJobStats> => {
      const queryParams = new URLSearchParams();
      if (days) queryParams.append('days', days.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/staffluent-superadmin/cron-stats${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Get task assignment statistics
    getTaskStats: async (): Promise<TaskStats> => {
      const { data } = await api.get('/staffluent-superadmin/task-stats');
      return data;
    },

    // Get employee statistics
    getEmployeeStats: async (): Promise<EmployeeStats> => {
      const { data } = await api.get('/staffluent-superadmin/employee-stats');
      return data;
    },

    // Get auto-assignment statistics
    getAutoAssignStats: async (days?: number): Promise<AutoAssignStats> => {
      const queryParams = new URLSearchParams();
      if (days) queryParams.append('days', days.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/staffluent-superadmin/auto-assignment-stats${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Get detailed business information
    getBusinessDetails: async (businessId: string, days?: number): Promise<BusinessDetailsResponse> => {
      const queryParams = new URLSearchParams();
      if (days) queryParams.append('days', days.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/staffluent-superadmin/business/${businessId}${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    getWeatherMonitoringStats: async (days?: number): Promise<WeatherMonitoringStats> => {
      const queryParams = new URLSearchParams();
      if (days) queryParams.append('days', days.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/staffluent-superadmin/weather-monitoring${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    }
  };

  
};