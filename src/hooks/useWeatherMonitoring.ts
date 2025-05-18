// hooks/useWeatherMonitoring.ts
import { useState, useCallback, useMemo } from 'react';
import { createSyncHistoryApi } from '@/app/api/external/omnigateway/sync-history';
import { WeatherMonitoringStats } from '@/app/api/external/omnigateway/types/cron-history';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useWeatherMonitoring = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherStats, setWeatherStats] = useState<WeatherMonitoringStats | null>(null);
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSyncHistoryApi(apiKey) : null, [apiKey]);

  // Fetch weather monitoring statistics
  const fetchWeatherMonitoringStats = useCallback(async (days?: number) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getWeatherMonitoringStats(days);
      setWeatherStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching weather monitoring stats:", error);
      toast.error("Failed to fetch weather monitoring statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    weatherStats,
    fetchWeatherMonitoringStats,
    isInitialized: !!api
  };
};