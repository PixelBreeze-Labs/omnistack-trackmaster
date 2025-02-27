// app/api/external/omnigateway/user.ts
import { createOmniGateway } from './index';
import { CreateOmniStackUserData, OmniStackUserResponse, StaffUserParams, StaffUsersResponse } from './types/users';


export const createOmniStackUserApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    createUser: async (userData: CreateOmniStackUserData) => {
      const { data } = await api.post('/users', userData);
      return data as OmniStackUserResponse;
    },
    deleteUser: async (userId: string) => {
      const { data } = await api.delete(`/users/${userId}`);
      return data;
    },
    getStaffUsers: async (params: StaffUserParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      
      const queryString = queryParams.toString();
      const endpoint = `/users/staff${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<StaffUsersResponse>(endpoint);
      return data;
    }
  };
};