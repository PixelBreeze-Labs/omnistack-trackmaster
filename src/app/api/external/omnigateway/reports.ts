// src/app/api/external/omnigateway/reports.ts

import { createOmniGateway } from './index';
import { ReportsResponse, ReportParams, Report } from './types/reports';

export const createReportsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  // Add the API key to every request header for consistency
  api.interceptors.request.use(config => {
    config.headers['x-api-key'] = apiKey;
    return config;
  });

  return {
    // Get all reports with optional filtering
    getReports: async (params: ReportParams = {}) => {
      const queryParams = new URLSearchParams();
      
      // Handle pagination
      if (params.page !== undefined && params.limit !== undefined) {
        // Convert page to skip
        const skip = (params.page - 1) * params.limit;
        queryParams.append('skip', skip.toString());
        queryParams.append('limit', params.limit.toString());
      } else {
        if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      }
      
      // Add other filters
      if (params.status) queryParams.append('status', params.status);
      if (params.clientAppId) queryParams.append('clientAppId', params.clientAppId);
      if (params.search) queryParams.append('search', params.search);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      if (params.priority) queryParams.append('priority', params.priority);
      
      const queryString = queryParams.toString();
      const endpoint = `/reports${queryString ? `?${queryString}` : ''}`;
      
      try {
        const { data } = await api.get<ReportsResponse>(endpoint);
        return data;
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
    },
    
    // Get a single report by ID
    getReport: async (id: string): Promise<Report> => {
      try {
        const { data } = await api.get<Report>(`/reports/${id}`);
        return data;
      } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
        throw error;
      }
    },
    
    // Update a report status
    updateReportStatus: async (id: string, status: string): Promise<Report> => {
      try {
        const { data } = await api.patch<Report>(`/reports/${id}/status`, { status });
        return data;
      } catch (error) {
        console.error(`Error updating report status ${id}:`, error);
        throw error;
      }
    },
    
    // Update a report
    updateReport: async (id: string, reportData: Partial<Report>): Promise<Report> => {
      try {
        const { data } = await api.put<Report>(`/reports/${id}`, reportData);
        return data;
      } catch (error) {
        console.error(`Error updating report ${id}:`, error);
        throw error;
      }
    },
    
    // Delete a report
    deleteReport: async (id: string): Promise<void> => {
      try {
        await api.delete(`/reports/${id}`);
      } catch (error) {
        console.error(`Error deleting report ${id}:`, error);
        throw error;
      }
    },
    
    // Get summary data for reports (for dashboard/metrics)
    getReportsSummary: async (clientAppId?: string): Promise<ReportsResponse> => {
      const queryParams = new URLSearchParams();
      if (clientAppId) queryParams.append('clientAppId', clientAppId);
      
      const queryString = queryParams.toString();
      const endpoint = `/reports/summary${queryString ? `?${queryString}` : ''}`;
      
      try {
        const { data } = await api.get<ReportsResponse>(endpoint);
        return data;
      } catch (error) {
        console.error('Error fetching reports summary:', error);
        throw error;
      }
    }
  };
};