// app/api/external/omnigateway/business.ts
import { createOmniGateway } from './index';
import { 
  BusinessParams, 
  BusinessesResponse,
  BusinessCapabilitiesUpdate,
} from './types/business';

export const createBusinessApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get business details
    getBusinessDetails: async (businessId: string) => {
      const { data } = await api.get(`/businesses/${businessId}`);
      return data;
    },

    // Update business details
    updateBusiness: async (businessId: string, updateData) => {
      const { data } = await api.patch(`/businesses/${businessId}`, updateData);
      return data;
    },

    // Update business capabilities
    updateBusinessCapabilities: async (businessId: string, capabilities: BusinessCapabilitiesUpdate) => {
      const { data } = await api.patch(`/businesses/${businessId}/capabilities`, capabilities);
      return data;
    },

    // Update employee capabilities
    updateEmployeeCapabilities: async (employeeId: string, capabilities) => {
      const { data } = await api.patch(`/businesses/employee/${employeeId}/capabilities`, capabilities);
      return data;
    },

    // Update employee details
    updateEmployee: async (employeeId: string, updateData) => {
      const { data } = await api.patch(`/businesses/employee/${employeeId}`, updateData);
      return data;
    },

    // Deactivate a business
    deactivateBusiness: async (businessId: string) => {
      const { data } = await api.patch(`/businesses/${businessId}/deactivate`);
      return data;
    },

    // Activate a business
    activateBusiness: async (businessId: string) => {
      const { data } = await api.patch(`/businesses/${businessId}/activate`);
      return data;
    },

    // Mark a business as a test account
    updateTestAccountStatus: async (businessId: string, isTestAccount: boolean) => {
      const { data } = await api.patch(`/businesses/${businessId}/mark-test-account`, {
        isTestAccount
      });
      return data;
    },
    
    // Soft delete a business
    softDeleteBusiness: async (businessId: string) => {
      const { data } = await api.patch(`/businesses/${businessId}/delete`);
      return data;
    },
    
    // Get all businesses with optional filtering
    getBusinesses: async (params: BusinessParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.isTrialing !== undefined) queryParams.append('isTrialing', params.isTrialing.toString());
      if (params.isTestAccount !== undefined) queryParams.append('isTestAccount', params.isTestAccount.toString());
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/businesses${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },
    
    // Get trial businesses (convenience method that sets isTrialing=true)
    getTrialBusinesses: async (params: Omit<BusinessParams, 'isTrialing' | 'status'> = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.isTestAccount !== undefined) queryParams.append('isTestAccount', params.isTestAccount.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/businesses/trials${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Send magic link to user
    sendMagicLink: async (email: string) => {
      const { data } = await api.post('/magic-link/send', { email });
      return data;
    }
  };
};