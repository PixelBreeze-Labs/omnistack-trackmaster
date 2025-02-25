// app/api/external/omnigateway/subscription-config.ts
import { createOmniGateway } from './index';
import { UpdateSubscriptionConfigDto, SubscriptionConfig } from './types/subscription-config';

export const createSubscriptionConfigApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get current subscription configuration
    getConfig: async (): Promise<SubscriptionConfig> => {
      const { data } = await api.get('/subscription-config');
      return data;
    },
    
    // Update subscription configuration
    updateConfig: async (configData: UpdateSubscriptionConfigDto): Promise<SubscriptionConfig> => {
      const { data } = await api.put('/subscription-config', configData);
      return data;
    }
  };
};