import { useState, useCallback, useMemo } from 'react';
import { 
  createReportAnalyticsApi, 
  AnalyticsParams 
} from '@/app/api/external/omnigateway/report-analytics';
import { useGatewayClientApiKey } from '@/hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useReportAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resolutionMetrics, setResolutionMetrics] = useState<any | null>(null);
  const [categoryTrends, setCategoryTrends] = useState<any | null>(null);
  const [geographicDistribution, setGeographicDistribution] = useState<any | null>(null);
  const [responseTimeMetrics, setResponseTimeMetrics] = useState<any | null>(null);
  const [userEngagementMetrics, setUserEngagementMetrics] = useState<any | null>(null);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<any | null>(null);
  const [trendingKeywords, setTrendingKeywords] = useState<any | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createReportAnalyticsApi(apiKey) : null, [apiKey]);

  const fetchResolutionMetrics = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getResolutionMetrics(params);
      setResolutionMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching resolution metrics:', error);
      toast.error('Failed to fetch resolution metrics');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchCategoryTrends = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getCategoryTrends(params);
      setCategoryTrends(data);
      return data;
    } catch (error) {
      console.error('Error fetching category trends:', error);
      toast.error('Failed to fetch category trends');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchGeographicDistribution = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getGeographicDistribution(params);
      setGeographicDistribution(data);
      return data;
    } catch (error) {
      console.error('Error fetching geographic distribution:', error);
      toast.error('Failed to fetch geographic distribution');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchResponseTimeMetrics = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getResponseTimeMetrics(params);
      setResponseTimeMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching response time metrics:', error);
      toast.error('Failed to fetch response time metrics');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchUserEngagementMetrics = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getUserEngagementMetrics(params);
      setUserEngagementMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching user engagement metrics:', error);
      toast.error('Failed to fetch user engagement metrics');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchComparativeAnalysis = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getComparativeAnalysis(params);
      setComparativeAnalysis(data);
      return data;
    } catch (error) {
      console.error('Error fetching comparative analysis:', error);
      toast.error('Failed to fetch comparative analysis');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchTrendingKeywords = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const data = await api.getTrendingKeywords(params);
      setTrendingKeywords(data);
      return data;
    } catch (error) {
      console.error('Error fetching trending keywords:', error);
      toast.error('Failed to fetch trending keywords');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const loadAllAnalyticsData = useCallback(async (params: AnalyticsParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      // Load everything in parallel
      await Promise.all([
        fetchResolutionMetrics(params),
        fetchCategoryTrends(params),
        fetchGeographicDistribution(params),
        fetchResponseTimeMetrics(params),
        fetchUserEngagementMetrics(params),
        fetchComparativeAnalysis(params),
        fetchTrendingKeywords(params)
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [
    api,
    fetchResolutionMetrics,
    fetchCategoryTrends,
    fetchGeographicDistribution,
    fetchResponseTimeMetrics,
    fetchUserEngagementMetrics,
    fetchComparativeAnalysis,
    fetchTrendingKeywords
  ]);

  return {
    isLoading,
    resolutionMetrics,
    categoryTrends,
    geographicDistribution,
    responseTimeMetrics,
    userEngagementMetrics,
    comparativeAnalysis,
    trendingKeywords,
    fetchResolutionMetrics,
    fetchCategoryTrends,
    fetchGeographicDistribution,
    fetchResponseTimeMetrics,
    fetchUserEngagementMetrics,
    fetchComparativeAnalysis,
    fetchTrendingKeywords,
    loadAllAnalyticsData,
    isInitialized: !!api
  };
};