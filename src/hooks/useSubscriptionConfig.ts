// hooks/useSubscriptionConfig.ts
import { useState, useCallback, useMemo } from 'react';
import { createSubscriptionConfigApi } from '@/app/api/external/omnigateway/subscription-config';
import { SubscriptionConfig, UpdateSubscriptionConfigDto } from "@/app/api/external/omnigateway/types/subscription-config";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useSubscriptionConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<SubscriptionConfig | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSubscriptionConfigApi(apiKey) : null, [apiKey]);

  // Fetch current subscription configuration
  const fetchConfig = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const data = await api.getConfig();
      setConfig(data);
      return data;
    } catch (error) {
      console.error('Error fetching subscription config:', error);
      toast.error('Failed to fetch subscription configuration');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Update subscription configuration
  const updateConfig = useCallback(async (updateData: UpdateSubscriptionConfigDto) => {
    if (!api) return;
    try {
      setIsSaving(true);
      const data = await api.updateConfig(updateData);
      setConfig(data);
      toast.success('Subscription configuration updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating subscription config:', error);
      toast.error('Failed to update subscription configuration');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [api]);

  return {
    isLoading,
    isSaving,
    config,
    fetchConfig,
    updateConfig,
    isInitialized: !!api
  };
};