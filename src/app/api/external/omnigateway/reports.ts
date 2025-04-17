// src/app/api/external/omnigateway/reports.ts
import { createOmniGateway } from './index';
import { ReportsResponse, ReportParams, Report, ReportStatus } from './types/reports';

export const createReportsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);
  
  return {
    // Get all reports with optional filtering
    getReports: async (params: ReportParams = {}): Promise<ReportsResponse> => {
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
      
      // Include summary by default
      queryParams.append('includeSummary', 'true');
      
      const queryString = queryParams.toString();
      const endpoint = `/api/reports${queryString ? `?${queryString}` : ''}`;
      
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
        const { data } = await api.get<Report>(`/api/reports/${id}`);
        return data;
      } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
        throw error;
      }
    },
    
    // Update a report status
    updateReportStatus: async (id: string, status: ReportStatus): Promise<Report> => {
      try {
        const { data } = await api.put<Report>(`/api/reports/${id}/status`, { status });
        return data;
      } catch (error) {
        console.error(`Error updating report status ${id}:`, error);
        throw error;
      }
    },
    
    // Update a report
    updateReport: async (id: string, reportData: Partial<Report>): Promise<Report> => {
      try {
        const { data } = await api.put<Report>(`/api/reports/${id}`, reportData);
        return data;
      } catch (error) {
        console.error(`Error updating report ${id}:`, error);
        throw error;
      }
    },
    
    // Delete a report
    deleteReport: async (id: string): Promise<void> => {
      try {
        await api.delete(`/api/reports/${id}`);
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
      const endpoint = `/api/reports/summary${queryString ? `?${queryString}` : ''}`;
      
      try {
        const { data } = await api.get<ReportsResponse>(endpoint);
        return data;
      } catch (error) {
        console.error('Error fetching reports summary:', error);
        throw error;
      }
    },
    
    // Get summary data for reports by client ID
    getReportsSummaryByClientId: async (clientId: string): Promise<ReportsResponse> => {
      try {
        const { data } = await api.get<ReportsResponse>(`/api/reports/summary/client/${clientId}`);
        return data;
      } catch (error) {
        console.error(`Error fetching reports summary for client ${clientId}:`, error);
        throw error;
      }
    },
    
    // Get WP Reports data for a client
    getWPReportsData: async (clientId: string): Promise<any> => {
      try {
        const { data } = await api.get(`/api/reports/wp-reports/${clientId}`);
        return data;
      } catch (error) {
        console.error(`Error fetching WP reports data for client ${clientId}:`, error);
        throw error;
      }
    }
  };
};