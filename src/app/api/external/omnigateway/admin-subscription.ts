// app/api/external/omnigateway/admin-subscription.ts
import { createOmniGateway } from './index';

interface AdminRegisterBusinessRequest {
  // Business details
  businessName: string;
  businessEmail: string;
  businessType: string;
  fullName: string;
  phone?: string;
  
  // Address details (optional)
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  
  // Tax info (optional)
  taxId?: string;
  vatNumber?: string;
  
  // Subscription details
  subscription: {
    planId: string;
    interval: 'month' | 'year';
  };
  
  // Additional settings
  autoVerifyEmail?: boolean;
  sendWelcomeEmail?: boolean;
}

interface AdminRegisterBusinessResponse {
  success: boolean;
  message: string;
  businessId: string;
  userId: string;
  email: string;
  password: string;
  subscription: {
    id: string;
    status: string;
  };
  auth_response?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
    token: string;
    account_type: string;
    refresh_token: string;
  };
}

export const createAdminSubscriptionApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Register and subscribe a business in one step (admin only)
    registerAndSubscribeBusiness: async (data: AdminRegisterBusinessRequest): Promise<AdminRegisterBusinessResponse> => {
      const { data: response } = await api.post('/admin-subscription/admin-register', data);
      return response;
    },
  };
};