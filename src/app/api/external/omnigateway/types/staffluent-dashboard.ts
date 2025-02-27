// app/api/external/omnigateway/types/staffluent-dashboard.ts
import { Business } from './business';
import { User } from './users';

export interface DashboardSummary {
  businesses: {
    total: number;
    new: number;
    growth: number;
  };
  users: {
    total: number;
    new: number;
    growth: number;
  };
  subscriptions: {
    active: number;
    trial: number;
    pastDue: number;
    mrr: {
      value: number;
      currency: string;
    };
  };
}

export interface RecentData {
  businesses: Business[];
  users: User[];
}

export interface ChartData {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
}

export interface DashboardCharts {
  businessGrowth: ChartData;
  userGrowth: ChartData;
  subscriptionDistribution: ChartData;
}

export interface DashboardSummaryResponse {
  summary: DashboardSummary;
  recentData: RecentData;
  charts: DashboardCharts;
}