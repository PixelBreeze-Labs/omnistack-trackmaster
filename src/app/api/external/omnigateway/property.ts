// app/api/external/omnigateway/property.ts
import { createOmniGateway } from './index';
import { RentalUnit, RentalUnitParams, RentalUnitsResponse, SyncResponse } from './types/properties';

export const createOmniStackPropertyApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getRentalUnits: async (params: RentalUnitParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);
      
      const queryString = queryParams.toString();
      const endpoint = `/vb/rental-units${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<RentalUnitsResponse>(endpoint);
      return data;
    },
    
        getRentalUnitById: async (id: string) => {
        const { data } = await api.get(`/properties/${id}`);
        return data;
        },
    
    syncRentalUnits: async () => {
      const { data } = await api.post<SyncResponse>('/properties/sync');
      return data;
    },
    
  };
};