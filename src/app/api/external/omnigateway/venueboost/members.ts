// app/api/external/venueboost/members.ts
import { createOmniGateway } from '../index';
import { ExternalMember } from '../types/members';

export interface VenueBoostMembersResponse {
  data: ExternalMember[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  metrics?: {
    trends: {
      monthly: number;
      conversion: number;
      active: number;
      recent: number;
    }
  }
}

export const createVenueBoostApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getMembers: async (params: {
      page?: number;
      per_page?: number;
      registration_source?: 'from_my_club' | 'landing_page';
      search?: string;
      status?: string;
    }): Promise<VenueBoostMembersResponse> => {
      const { data } = await api.get('/vb/members', { params });
      return data;
    },
    approveMember: async (id: string) => {
      const { data } = await api.post(`/vb/members/${id}/approve`);
      return data;
    },
    rejectMember: async (id: string, reason?: string) => {
      const { data } = await api.post(`/vb/members/${id}/reject`, { rejection_reason: reason });
      return data;
    },
    exportMembers: async (registration_source?: 'from_my_club' | 'landing_page') => {
      const { data } = await api.get(`/vb/members/export`, {
        params: { registration_source }
      });
      return data;
    }
  };
};
