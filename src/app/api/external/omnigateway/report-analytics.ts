import { createOmniGateway } from './index';

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}

export const createReportAnalyticsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get report resolution metrics
    getResolutionMetrics: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/resolution', { params });
      return data;
    },
    
    // Get category breakdown over time
    getCategoryTrends: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/category-trends', { params });
      return data;
    },
    
    // Get geographic distribution of reports
    getGeographicDistribution: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/geographic', { params });
      return data;
    },
    
    // Get response time metrics
    getResponseTimeMetrics: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/response-time', { params });
      return data;
    },
    
    // Get user engagement metrics
    getUserEngagementMetrics: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/user-engagement', { params });
      return data;
    },
    
    // Get comparative analysis (e.g., this month vs. last month)
    getComparativeAnalysis: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/comparative', { params });
      return data;
    },
    
    // Get trending keywords from report content
    getTrendingKeywords: async (params: AnalyticsParams = {}) => {
      const { data } = await api.get('/community-reports/analytics/keywords', { params });
      return data;
    }
  };
};