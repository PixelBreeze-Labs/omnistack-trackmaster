// hooks/useStaffluentDashboard.ts
import { useState, useCallback, useMemo } from 'react';
import { createDashboardApi } from '@/app/api/external/omnigateway/staffluent-dashboard';
import { DashboardSummaryResponse } from '@/app/api/external/omnigateway/types/staffluent-dashboard';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createDashboardApi(apiKey) : null, [apiKey]);

  // Fetch dashboard summary data
  const fetchDashboardSummary = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      // hooks/useDashboard.ts (continuing from where it was interrupted)
      const response = await api.getDashboardSummary();
      setDashboardData(response);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    dashboardData,
    fetchDashboardSummary,
    isInitialized: !!api
  };
};