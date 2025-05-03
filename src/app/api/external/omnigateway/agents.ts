// app/api/external/omnigateway/agents.ts
import { createOmniGateway } from './index';

export const createAgentsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all agent configurations for a business
    getBusinessAgents: async (businessId: string) => {
      const { data } = await api.get(`/agent-configuration/business/${businessId}`);
      return data;
    },

    // Get configuration for a specific agent
    getAgentConfiguration: async (businessId: string, agentType: string) => {
      const { data } = await api.get(`/agent-configuration/business/${businessId}/agent/${agentType}`);
      return data;
    },

    // Enable an agent for a business
    enableAgent: async (clientId: string, businessId: string, agentType: string) => {
      const { data } = await api.post(`/agent-configuration/client/${clientId}/business/${businessId}/agent/${agentType}/enable`);
      return data;
    },

    // Disable an agent for a business
    disableAgent: async (businessId: string, agentType: string) => {
      const { data } = await api.post(`/agent-configuration/business/${businessId}/agent/${agentType}/disable`);
      return data;
    },

    // Update agent configuration
    updateAgentConfiguration: async (businessId: string, agentType: string, configData: any) => {
      const { data } = await api.put(`/agent-configuration/business/${businessId}/agent/${agentType}/configuration`, configData);
      return data;
    }
  };
};