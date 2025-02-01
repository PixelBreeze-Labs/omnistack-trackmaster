// app/api/external/omnigateway/user.ts
import { createOmniGateway } from './index';
import { CreateOmniStackUserData, OmniStackUserResponse } from './types/users';


export const createOmniStackUserApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    createUser: async (userData: CreateOmniStackUserData) => {
      const { data } = await api.post('/users', userData);
      return data as OmniStackUserResponse;
    }
  };
};