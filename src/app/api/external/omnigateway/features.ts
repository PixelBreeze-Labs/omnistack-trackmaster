// app/api/external/omnigateway/features.ts
import { createOmniGateway } from './index';

export const createFeaturesApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all feature configuration
    getFeatureConfig: async () => {
      const { data } = await api.get('/admin/features/config');
      return data;
    },

    // Get features for a specific business
    getBusinessFeatures: async (businessId: string) => {
      const { data } = await api.get(`/admin/features/business/${businessId}`);
      return data;
    },

    // Add a custom feature to a business
    addCustomFeature: async (businessId: string, featureKey: string) => {
      const { data } = await api.post(`/admin/features/business/${businessId}/custom-feature`, {
        featureKey
      });
      return data;
    },

    // Remove a custom feature from a business
    removeCustomFeature: async (businessId: string, featureKey: string) => {
      const { data } = await api.delete(`/admin/features/business/${businessId}/custom-feature/${featureKey}`);
      return data;
    },

    // Set a custom limit for a business
    setCustomLimit: async (businessId: string, limitKey: string, value: number) => {
      const { data } = await api.post(`/admin/features/business/${businessId}/custom-limit`, {
        limitKey,
        value
      });
      return data;
    },

    // Remove a custom limit from a business
    removeCustomLimit: async (businessId: string, limitKey: string) => {
      const { data } = await api.delete(`/admin/features/business/${businessId}/custom-limit/${limitKey}`);
      return data;
    }
  };
};