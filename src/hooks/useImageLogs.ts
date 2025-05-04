// hooks/useImageLogs.ts
import { useState, useCallback, useMemo } from 'react';
import { createLogApi } from '@/app/api/external/omnigateway/logs';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';


export const useImageLogs = () => {
  const [logs, setLogs] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createLogApi(apiKey) : null, [apiKey]);

  // Fetch logs with filtering and pagination
  const fetchLogs = useCallback(async (params = {}) => {
    if (!api) return;
    
    setIsLoading(true);
    try {
      const response = await api.getLogs(params);
      setLogs(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch log stats
  const fetchLogStats = useCallback(async () => {
    if (!api) return;
    
    try {
      const statsData = await api.getLogStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching log stats:', error);
      // Initialize with empty arrays to prevent null reference errors
      setStats({
        total: 0,
        errorRate: 0,
        byType: [],
        byAction: []
      });
    }
  }, [api]);

  // Get logs for a specific session
  const getSessionLogs = useCallback(async (sessionId) => {
    if (!api || !sessionId) return [];
    
    setIsLoading(true);
    try {
      const sessionLogs = await api.getSessionLogs(sessionId);
      return sessionLogs;
    } catch (error) {
      console.error(`Error fetching logs for session ${sessionId}:`, error);
      toast.error('Failed to fetch session logs');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [api]);


  // Clear all logs data
  const clearLogsData = useCallback(() => {
    setLogs([]);
    setTotalItems(0);
    setTotalPages(0);
    setCurrentPage(1);
    setStats(null);
  }, []);

  return {
    logs,
    totalItems,
    totalPages,
    currentPage,
    stats,
    isLoading,
    fetchLogs,
    fetchLogStats,
    getSessionLogs,
    clearLogsData,
    isInitialized: !!api
  };
};