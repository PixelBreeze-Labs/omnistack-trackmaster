import { useState, useCallback, useMemo } from 'react';
import { createFeaturesApi } from '@/app/api/external/omnigateway/features';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useFeatures = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState(null);
  const [tierFeatures, setTierFeatures] = useState(null);
  const [tierLimits, setTierLimits] = useState(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createFeaturesApi(apiKey) : null, [apiKey]);

  // Fetch all features configuration
  const fetchFeatures = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getFeatureConfig();
      setFeatures(response.features);
      setTierFeatures(response.tierFeatures);
      setTierLimits(response.tierLimits);
      return response;
    } catch (error) {
      toast.error('Failed to fetch features configuration');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get features for a specific business
  const getBusinessFeatures = useCallback(async (businessId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBusinessFeatures(businessId);
      return response;
    } catch (error) {
      toast.error('Failed to fetch business features');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Add a custom feature to a business
  const addCustomFeature = useCallback(async (businessId: string, featureKey: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.addCustomFeature(businessId, featureKey);
      toast.success('Custom feature added successfully');
      return response;
    } catch (error) {
      toast.error('Failed to add custom feature');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Remove a custom feature from a business
  const removeCustomFeature = useCallback(async (businessId: string, featureKey: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.removeCustomFeature(businessId, featureKey);
      toast.success('Custom feature removed successfully');
      return response;
    } catch (error) {
      toast.error('Failed to remove custom feature');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Set a custom limit for a business
  const setCustomLimit = useCallback(async (businessId: string, limitKey: string, value: number) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.setCustomLimit(businessId, limitKey, value);
      toast.success('Custom limit set successfully');
      return response;
    } catch (error) {
      toast.error('Failed to set custom limit');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Remove a custom limit from a business
  const removeCustomLimit = useCallback(async (businessId: string, limitKey: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.removeCustomLimit(businessId, limitKey);
      toast.success('Custom limit removed successfully');
      return response;
    } catch (error) {
      toast.error('Failed to remove custom limit');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    features,
    tierFeatures,
    tierLimits,
    fetchFeatures,
    getBusinessFeatures,
    addCustomFeature,
    removeCustomFeature,
    setCustomLimit,
    removeCustomLimit,
    isInitialized: !!api
  };
};