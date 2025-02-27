// app/api/external/omnigateway/types/staffluent-analytics.ts

export interface MetricWithGrowth {
    current: number;
    previous: number;
    growth: number;
  }
  
  export interface TimeframeData {
    start: string;
    end: string;
  }
  
  export interface ChartData {
    labels: string[];
    data: any[];
  }
  
  export interface BusinessAnalyticsResponse {
    period: string;
    timeframe: TimeframeData;
    metrics: {
      newBusinesses: MetricWithGrowth;
      activeBusinesses: MetricWithGrowth;
      mrr: {
        value: number;
        currency: string;
      };
    };
    subscriptionDistribution: Record<string, number>;
    businessGrowth: {
      labels: string[];
      data: Array<{
        month: string;
        totalBusinesses: number;
      }>;
    };
  }
  
  export interface UserAnalyticsResponse {
    period: string;
    timeframe: TimeframeData;
    metrics: {
      newUsers: MetricWithGrowth;
      staffUsers: {
        total: number;
      };
      usersWithBusinesses: {
        total: number;
        withBusinesses: number;
        percentage: number;
      };
    };
    registrationSourceDistribution: Record<string, number>;
    userGrowth: {
      labels: string[];
      data: Array<{
        month: string;
        totalUsers: number;
      }>;
    };
  }