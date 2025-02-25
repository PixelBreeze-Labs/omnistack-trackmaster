import { useState, useCallback, useMemo } from 'react';
import { createSubscriptionsApi } from '@/app/api/external/omnigateway/subscriptions';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { 
  Subscription,
  SubscriptionMetrics,
  SubscriptionParams,
  SubscriptionsResponse
} from '@/app/api/external/omnigateway/types/subscription';
import toast from 'react-hot-toast';

export const useBusinessSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSubscriptionsApi(apiKey) : null, [apiKey]);

  // Fetch subscriptions with optional filters
  const fetchSubscriptions = useCallback(async (params: SubscriptionParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const response: SubscriptionsResponse = await api.getSubscriptions(params);
      setSubscriptions(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch active subscriptions
  const fetchActiveSubscriptions = useCallback(async (params: Omit<SubscriptionParams, 'status'> = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const response: SubscriptionsResponse = await api.getActiveSubscriptions(params);
      setSubscriptions(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      toast.error('Failed to fetch active subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch past due subscriptions
  const fetchPastDueSubscriptions = useCallback(async (params: Omit<SubscriptionParams, 'status'> = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const response: SubscriptionsResponse = await api.getPastDueSubscriptions(params);
      setSubscriptions(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching past due subscriptions:', error);
      toast.error('Failed to fetch past due subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch canceled subscriptions
  const fetchCanceledSubscriptions = useCallback(async (params: Omit<SubscriptionParams, 'status'> = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const response: SubscriptionsResponse = await api.getCanceledSubscriptions(params);
      setSubscriptions(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching canceled subscriptions:', error);
      toast.error('Failed to fetch canceled subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get subscription details
  const getSubscriptionDetails = useCallback(async (subscriptionId: string) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const subscription = await api.getSubscriptionDetails(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      toast.error('Failed to fetch subscription details');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Update subscription
  const updateSubscription = useCallback(async (subscriptionId: string, updateData: any) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const updatedSubscription = await api.updateSubscription(subscriptionId, updateData);
      toast.success('Subscription updated successfully');
      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId: string, cancelData = {}) => {
    if (!api) return;

    setIsCanceling(true);
    try {
      const result = await api.cancelSubscription(subscriptionId, cancelData);
      toast.success('Subscription canceled successfully');
      return result;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  }, [api]);

  return {
    isLoading,
    isCanceling,
    subscriptions,
    totalItems,
    totalPages,
    metrics,
    fetchSubscriptions,
    fetchActiveSubscriptions,
    fetchPastDueSubscriptions,
    fetchCanceledSubscriptions,
    getSubscriptionDetails,
    updateSubscription,
    cancelSubscription,
    isInitialized: !!api
  };
};