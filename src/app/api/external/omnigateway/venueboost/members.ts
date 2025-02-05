// app/api/external/venueboost/members.ts
import { createOmniGateway } from '../index';
import { ExternalMember } from '../types/members';

export interface VenueBoostMembersResponse {
  data: ExternalMember[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const createVenueBoostApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getMembers: async (params: {
      page?: number;
      per_page?: number;
      registration_source?: 'from_my_club' | 'landing_page';
    }): Promise<VenueBoostMembersResponse> => {
      const { data } = await api.get('/vb/members', { params });
      return data;
    },
    approveMember: async (id: string) => {
      const { data } = await api.post(`/vb/members/${id}/approve`);
      return data;
    },
    rejectMember: async (id: string) => {
      const { data } = await api.post(`/vb/members/${id}/reject`);
      return data;
    }
  };
};