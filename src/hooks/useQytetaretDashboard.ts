import { useState, useCallback, useMemo } from 'react';
import { createDashboardApi, DashboardStats } from '@/app/api/external/omnigateway/qytetaret-dashboard';
import { useGatewayClientApiKey } from '@/hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useQytetaretDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [reportsByCategory, setReportsByCategory] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [reportsByStatus, setReportsByStatus] = useState<any[]>([]);
  const [topLocations, setTopLocations] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [citizenMetrics, setCitizenMetrics] = useState<any | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createDashboardApi(apiKey) : null, [apiKey]);

  const fetchDashboardStats = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getDashboardStats();
      setDashboardStats(data);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchReportsByCategory = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getReportsByCategory();
      setReportsByCategory(data);
      return data;
    } catch (error) {
      console.error('Error fetching reports by category:', error);
      // Don't show toast here to avoid multiple error messages
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchMonthlyTrends = useCallback(async (year?: number) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getMonthlyReportTrends(year);
      setMonthlyTrends(data);
      return data;
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchReportsByStatus = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getReportsByStatus();
      setReportsByStatus(data);
      return data;
    } catch (error) {
      console.error('Error fetching reports by status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchTopLocations = useCallback(async (limit?: number) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getTopReportLocations(limit);
      setTopLocations(data);
      return data;
    } catch (error) {
      console.error('Error fetching top locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchRecentReports = useCallback(async (limit?: number) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getRecentReports(limit);
      setRecentReports(data);
      return data;
    } catch (error) {
      console.error('Error fetching recent reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchCitizenMetrics = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getCitizenEngagementMetrics();
      setCitizenMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching citizen metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const loadAllDashboardData = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    try {
      // Load everything in parallel
      await Promise.all([
        fetchDashboardStats(),
        fetchReportsByCategory(),
        fetchMonthlyTrends(),
        fetchReportsByStatus(),
        fetchTopLocations(),
        fetchRecentReports(),
        fetchCitizenMetrics()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [
    api, 
    fetchDashboardStats, 
    fetchReportsByCategory, 
    fetchMonthlyTrends,
    fetchReportsByStatus,
    fetchTopLocations,
    fetchRecentReports,
    fetchCitizenMetrics
  ]);

  return {
    isLoading,
    dashboardStats,
    reportsByCategory,
    monthlyTrends,
    reportsByStatus,
    topLocations,
    recentReports,
    citizenMetrics,
    fetchDashboardStats,
    fetchReportsByCategory,
    fetchMonthlyTrends,
    fetchReportsByStatus,
    fetchTopLocations,
    fetchRecentReports,
    fetchCitizenMetrics,
    loadAllDashboardData,
    isInitialized: !!api
  };
};