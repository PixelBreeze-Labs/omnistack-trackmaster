// hooks/useSyncHistory.ts
import { useState, useCallback, useMemo } from 'react';
import { createSyncHistoryApi } from '@/app/api/external/omnigateway/sync-history';
import { 
  CronJobHistoryItem,
  CronJobStats,
  TaskStats,
  EmployeeStats,
  AutoAssignStats,
  BusinessDetailsResponse
} from '@/app/api/external/omnigateway/types/cron-history';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useSyncHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cronJobs, setCronJobs] = useState<CronJobHistoryItem[]>([]);
  const [cronStats, setCronStats] = useState<CronJobStats | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
  const [autoAssignStats, setAutoAssignStats] = useState<AutoAssignStats | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsResponse | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSyncHistoryApi(apiKey) : null, [apiKey]);

  // Fetch cron job history with pagination and filters
  const fetchCronJobHistory = useCallback(async (params: {
    page?: number;
    limit?: number;
    status?: 'completed' | 'failed' | 'started';
    jobName?: string;
    businessId?: string;
  } = {}) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const response = await api.getCronJobHistory(params);
      
      setCronJobs(response.jobs);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(response.page);
      
      return response;
    } catch (error) {
      console.error("Error fetching cron job history:", error);
      toast.error("Failed to fetch sync history");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch cron job statistics
  const fetchCronJobStats = useCallback(async (days?: number) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getCronJobStats(days);
      setCronStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching cron job stats:", error);
      toast.error("Failed to fetch sync statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch task assignment statistics
  const fetchTaskStats = useCallback(async () => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getTaskStats();
      setTaskStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching task stats:", error);
      toast.error("Failed to fetch task statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch employee statistics
  const fetchEmployeeStats = useCallback(async () => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getEmployeeStats();
      setEmployeeStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      toast.error("Failed to fetch employee statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch auto-assignment statistics
  const fetchAutoAssignStats = useCallback(async (days?: number) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getAutoAssignStats(days);
      setAutoAssignStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching auto-assignment stats:", error);
      toast.error("Failed to fetch auto-assignment statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch detailed business information
  const fetchBusinessDetails = useCallback(async (businessId: string, days?: number) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const details = await api.getBusinessDetails(businessId, days);
      setBusinessDetails(details);
      return details;
    } catch (error) {
      console.error("Error fetching business details:", error);
      toast.error("Failed to fetch business details");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    cronJobs,
    cronStats,
    taskStats,
    employeeStats,
    autoAssignStats,
    businessDetails,
    totalItems,
    totalPages,
    currentPage,
    fetchCronJobHistory,
    fetchCronJobStats,
    fetchTaskStats,
    fetchEmployeeStats,
    fetchAutoAssignStats,
    fetchBusinessDetails,
    isInitialized: !!api
  };
};