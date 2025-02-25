// hooks/useSubscription.ts
import { useState, useCallback, useMemo } from 'react';
import { createSubscriptionApi } from '@/app/api/external/omnigateway/subscription';
import { 
  StripeProduct,
  ProductMetrics, 
  ProductParams,
  SyncProductsResponse
} from "@/app/api/external/omnigateway/types/stripe-products";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [metrics, setMetrics] = useState<ProductMetrics>({
    totalProducts: 0,
    activeProducts: 0,
    totalPrices: 0,
    activePrices: 0,
    trends: {
      products: { value: 0, percentage: 0 },
      prices: { value: 0, percentage: 0 }
    }
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSubscriptionApi(apiKey) : null, [apiKey]);

  // Fetch products with their prices from our database
  const fetchProducts = useCallback(async (params: ProductParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getProducts(params);
      setProducts(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch products directly from Stripe (with prefix filter applied on server side)
  const fetchStripeProducts = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getStripeProducts();
      return response;
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
      toast.error('Failed to fetch Stripe products');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Sync products and prices from Stripe to our database
  // This will be filtered by the product prefix set in the client's subscription config
  const syncProducts = useCallback(async (): Promise<SyncProductsResponse | undefined> => {
    if (!api) return;
    try {
      setIsSyncing(true);
      const response = await api.syncProducts();
      toast.success(`Successfully synced ${response.productsCount} products and ${response.pricesCount} prices`);
      await fetchProducts(); // Refresh products after sync
      return response;
    } catch (error) {
      console.error('Error syncing products:', error);
      if (error.response?.data?.message?.includes('Product prefix not configured')) {
        toast.error('Product prefix not configured. Please set up your subscription configuration first.');
      } else if (error.response?.data?.message?.includes('Stripe configuration not found')) {
        toast.error('Stripe API key not configured. Please set up your subscription configuration first.');
      } else {
        toast.error('Failed to sync products with Stripe');
      }
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [api, fetchProducts]);

  return {
    isLoading,
    isSyncing,
    products,
    totalItems,
    totalPages,
    metrics,
    fetchProducts,
    fetchStripeProducts,
    syncProducts,
    isInitialized: !!api
  };
};