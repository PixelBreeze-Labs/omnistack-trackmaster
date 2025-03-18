import { createOmniGateway } from './index';

export interface DashboardStats {
  totalReports: number;
  resolvedReports: number;
  activeCitizens: number;
  averageResponseTime: number;
  recentReports: any[];
  categoryDistribution: {
    name: string;
    count: number;
  }[];
  monthlyReports: {
    month: string;
    value: number;
  }[];
  reportsByStatus: {
    status: string;
    count: number;
  }[];
  topLocations: {
    name: string;
    reports: number;
    resolvedRate: number;
  }[];
}

export const createDashboardApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get dashboard stats
    getDashboardStats: async () => {
      const { data } = await api.get('/community-reports/dashboard-stats');
      return data;
    },
    
    // Get reports by category
    getReportsByCategory: async () => {
      const { data } = await api.get('/community-reports/stats/by-category');
      return data;
    },
    
    // Get monthly report trends
    getMonthlyReportTrends: async (year: number = new Date().getFullYear()) => {
      const { data } = await api.get('/community-reports/stats/monthly', { params: { year } });
      return data;
    },
    
    // Get reports by status
    getReportsByStatus: async () => {
      const { data } = await api.get('/community-reports/stats/by-status');
      return data;
    },
    
    // Get top report locations
    getTopReportLocations: async (limit: number = 5) => {
      const { data } = await api.get('/community-reports/stats/top-locations', { params: { limit } });
      return data;
    },
    
    // Get recent reports
    getRecentReports: async (limit: number = 5) => {
      const { data } = await api.get('/community-reports/stats/recent', { params: { limit } });
      return data;
    },
    
    // Get citizen engagement metrics
    getCitizenEngagementMetrics: async () => {
      const { data } = await api.get('/community-reports/engagement-metrics');
      return data;
    }   
  };
};