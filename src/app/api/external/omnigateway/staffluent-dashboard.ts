// app/api/external/omnigateway/staffluent-dashboard.ts
import { createOmniGateway } from './index';
import { DashboardSummaryResponse } from './types/staffluent-dashboard';

export const createDashboardApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get dashboard summary data
    getDashboardSummary: async () => {
      const { data } = await api.get<DashboardSummaryResponse>('/staffluent-dashboard/summary');
      return data;
    }
  };
};