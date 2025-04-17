// src/hooks/useReports.ts

import { useState, useCallback, useMemo } from 'react';
import { createReportsApi } from '@/app/api/external/omnigateway/reports';
import { 
  ReportParams,
  Report,
  ReportStatus,
  ReportsSummary
} from "@/app/api/external/omnigateway/types/reports";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState<ReportsSummary | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createReportsApi(apiKey) : null, [apiKey]);

  // Fetch reports with optional filtering
  const fetchReports = useCallback(async (params: ReportParams = {}) => {
    if (!api) return null;
    try {
      setIsLoading(true);
      console.log("Fetching reports with params:", params);
      const response = await api.getReports(params);
      
      console.log('Reports API response:', response);
      
      setReports(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      
      // Set summary if it is returned from the API
      if (response.summary) {
        setSummary(response.summary);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching reports:', error);
      
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to fetch reports');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get reports summary (for dashboard/metrics)
  const fetchReportsSummary = useCallback(async (clientAppId?: string) => {
    if (!api) return null;
    try {
      setIsLoading(true);
      const response = await api.getReportsSummary(clientAppId);
      
      // Update summary state if available
      if (response.summary) {
        setSummary(response.summary);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching reports summary:', error);
      toast.error('Failed to fetch reports summary');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single report by ID
  const getReport = useCallback(async (id: string) => {
    if (!api) return null;
    try {
      setIsLoading(true);
      const report = await api.getReport(id);
      return report;
    } catch (error) {
      console.error('Error fetching report details:', error);
      toast.error('Failed to fetch report details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Update a report's status
  const updateReportStatus = useCallback(async (id: string, status: ReportStatus) => {
    if (!api) return null;
    try {
      setIsProcessing(true);
      const updatedReport = await api.updateReportStatus(id, status);
      
      // Update local state to reflect changes
      setReports(currentReports => 
        currentReports.map(report => 
          report._id === id ? updatedReport : report
        )
      );
      
      // Update summary counts if available
      if (summary) {
        const oldStatus = reports.find(r => r._id === id)?.status;
        
        if (oldStatus && oldStatus !== status) {
          setSummary(prevSummary => {
            if (!prevSummary) return null;
            
            const newSummary = { ...prevSummary };
            newSummary.byStatus[oldStatus] = Math.max(0, (newSummary.byStatus[oldStatus] || 0) - 1);
            newSummary.byStatus[status] = (newSummary.byStatus[status] || 0) + 1;
            
            return newSummary;
          });
        }
      }
      
      return updatedReport;
    } catch (error) {
      console.error('Error updating report status:', error);
      toast.error('Failed to update report status');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api, reports, summary]);

  // Update a report
  const updateReport = useCallback(async (id: string, reportData: Partial<Report>) => {
    if (!api) return null;
    try {
      setIsProcessing(true);
      const updatedReport = await api.updateReport(id, reportData);
      
      // Update local state to reflect changes
      setReports(currentReports => 
        currentReports.map(report => 
          report._id === id ? updatedReport : report
        )
      );
      
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api]);

  // Delete a report
  const deleteReport = useCallback(async (id: string) => {
    if (!api) {
      toast.error('API client not initialized');
      return false;
    }
    
    try {
      setIsProcessing(true);
      await api.deleteReport(id);
      
      // Update local state to remove deleted report
      setReports(currentReports => 
        currentReports.filter(report => report._id !== id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      // Update summary if available
      if (summary) {
        const deletedReport = reports.find(r => r._id === id);
        
        if (deletedReport) {
          setSummary(prevSummary => {
            if (!prevSummary) return null;
            
            const newSummary = { ...prevSummary };
            newSummary.total = Math.max(0, newSummary.total - 1);
            
            if (deletedReport.status) {
              newSummary.byStatus[deletedReport.status] = Math.max(
                0, 
                (newSummary.byStatus[deletedReport.status] || 0) - 1
              );
            }
            
            if (deletedReport.priority && newSummary.byPriority) {
              newSummary.byPriority[deletedReport.priority] = Math.max(
                0, 
                (newSummary.byPriority[deletedReport.priority] || 0) - 1
              );
            }
            
            return newSummary;
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [api, reports, summary]);

  return {
    isLoading,
    isProcessing,
    reports,
    totalItems,
    totalPages,
    summary,
    fetchReports,
    fetchReportsSummary,
    getReport,
    updateReportStatus,
    updateReport,
    deleteReport,
    isInitialized: !!api
  };
};