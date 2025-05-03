// hooks/useAgents.ts
import { useState, useCallback, useMemo } from 'react';
import { createAgentsApi } from '@/app/api/external/omnigateway/agents';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useAgents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [agentConfigurations, setAgentConfigurations] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createAgentsApi(apiKey) : null, [apiKey]);

  // Get all agent configurations for a business
  const getBusinessAgents = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBusinessAgents(businessId);
      
      // Handle both the old response format (just array of configs)
      // and the new format (object with configurations and availableAgents)
      if (Array.isArray(response)) {
        setAgentConfigurations(response);
        setAvailableAgents([]);
      } else {
        setAgentConfigurations(response.configurations || []);
        setAvailableAgents(response.availableAgents || []);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch agent configurations');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get configuration for a specific agent
  const getAgentConfiguration = useCallback(async (businessId: string, agentType: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getAgentConfiguration(businessId, agentType);
      return response;
    } catch (error) {
      toast.error('Failed to fetch agent configuration');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Enable an agent for a business
  const enableAgent = useCallback(async (businessId: string, agentType: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.enableAgent(businessId, agentType);
      toast.success('Agent enabled successfully');
      
      // Refresh the agent configurations after enabling
      await getBusinessAgents(businessId);
      
      return response;
    } catch (error) {
      toast.error('Failed to enable agent');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, getBusinessAgents]);

  // Disable an agent for a business
  const disableAgent = useCallback(async (businessId: string, agentType: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.disableAgent(businessId, agentType);
      toast.success('Agent disabled successfully');
      
      // Refresh the agent configurations after disabling
      await getBusinessAgents(businessId);
      
      return response;
    } catch (error) {
      toast.error('Failed to disable agent');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api, getBusinessAgents]);

  // Update agent configuration
  const updateAgentConfiguration = useCallback(async (businessId: string, agentType: string, configData: any) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateAgentConfiguration(businessId, agentType, configData);
      toast.success('Agent configuration updated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to update agent configuration');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    agentConfigurations,
    availableAgents,
    getBusinessAgents,
    getAgentConfiguration,
    enableAgent,
    disableAgent,
    updateAgentConfiguration,
    isInitialized: !!api
  };
};