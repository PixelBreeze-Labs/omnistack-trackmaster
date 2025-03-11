// src/hooks/usePromotions.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackPromotionApi } from '@/app/api/external/omnigateway/promotion';
import { 
  Promotion,
  PromotionParams,
  Discount,
  DiscountParams,
  DiscountType
} from "@/app/api/external/omnigateway/types/promotions";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const usePromotions = () => {
  // Promotions state
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [isDeletingPromotion, setIsDeletingPromotion] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsTotalItems, setPromotionsTotalItems] = useState(0);
  const [promotionsTotalPages, setPromotionsTotalPages] = useState(0);
  
  // Discounts state
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
  const [isDeletingDiscount, setIsDeletingDiscount] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [discountsTotalItems, setDiscountsTotalItems] = useState(0);
  const [discountsTotalPages, setDiscountsTotalPages] = useState(0);
  
  // Sync state
  const [isSyncingPromotions, setIsSyncingPromotions] = useState(false);
  const [isSyncingDiscounts, setIsSyncingDiscounts] = useState(false);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackPromotionApi(apiKey) : null, [apiKey]);

  // Fetch promotions with optional filtering
  const fetchPromotions = useCallback(async (params: PromotionParams = {}) => {
    if (!api) return;
    try {
      setIsLoadingPromotions(true);
      const response = await api.getPromotions(params);
      setPromotions(response.data);
      setPromotionsTotalItems(response.pagination.total);
      setPromotionsTotalPages(response.pagination.totalPages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch promotions');
      throw error;
    } finally {
      setIsLoadingPromotions(false);
    }
  }, [api]);

  // Get a single promotion by ID
  const getPromotion = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoadingPromotions(true);
      const promotion = await api.getPromotion(id);
      return promotion;
    } catch (error) {
      toast.error('Failed to fetch promotion details');
      throw error;
    } finally {
      setIsLoadingPromotions(false);
    }
  }, [api]);

  // Sync promotions from VenueBoost
  const syncPromotions = useCallback(async () => {
    if (!api) return;
    try {
      setIsSyncingPromotions(true);
      const response = await api.syncPromotions();
      return response;
    } catch (error) {
      toast.error('Failed to sync promotions');
      throw error;
    } finally {
      setIsSyncingPromotions(false);
    }
  }, [api]);

  // Delete a promotion
  const deletePromotion = useCallback(async (promotion: Promotion) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsDeletingPromotion(true);
      await api.deletePromotion(promotion.id);
      
      // Remove promotion from the local state to update UI
      setPromotions(currentPromotions => 
        currentPromotions.filter(p => p.id !== promotion.id)
      );
      
      // Update total count
      setPromotionsTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete promotion');
      }
      
      throw error;
    } finally {
      setIsDeletingPromotion(false);
    }
  }, [api]);

  // Fetch discounts with optional filtering
  const fetchDiscounts = useCallback(async (params: DiscountParams = {}) => {
    if (!api) return;
    try {
      setIsLoadingDiscounts(true);
      const response = await api.getDiscounts(params);
      setDiscounts(response.data);
      setDiscountsTotalItems(response.pagination.total);
      setDiscountsTotalPages(response.pagination.totalPages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch discounts');
      throw error;
    } finally {
      setIsLoadingDiscounts(false);
    }
  }, [api]);

  // Get a single discount by ID
  const getDiscount = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoadingDiscounts(true);
      const discount = await api.getDiscount(id);
      return discount;
    } catch (error) {
      toast.error('Failed to fetch discount details');
      throw error;
    } finally {
      setIsLoadingDiscounts(false);
    }
  }, [api]);

  // Sync discounts from VenueBoost
  const syncDiscounts = useCallback(async () => {
    if (!api) return;
    try {
      setIsSyncingDiscounts(true);
      const response = await api.syncDiscounts();
      return response;
    } catch (error) {
      toast.error('Failed to sync discounts');
      throw error;
    } finally {
      setIsSyncingDiscounts(false);
    }
  }, [api]);

  // Delete a discount
  const deleteDiscount = useCallback(async (discount: Discount) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsDeletingDiscount(true);
      await api.deleteDiscount(discount.id);
      
      // Remove discount from the local state to update UI
      setDiscounts(currentDiscounts => 
        currentDiscounts.filter(d => d.id !== discount.id)
      );
      
      // Update total count
      setDiscountsTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting discount:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete discount');
      }
      
      throw error;
    } finally {
      setIsDeletingDiscount(false);
    }
  }, [api]);

  // Sync both promotions and discounts
  const syncAllPromotionsAndDiscounts = useCallback(async () => {
    if (!api) return;
    try {
      setIsSyncingPromotions(true);
      setIsSyncingDiscounts(true);
      
      const promises = [api.syncPromotions(), api.syncDiscounts()];
      const [promotionsResult, discountsResult] = await Promise.all(promises);
      
      return {
        promotions: promotionsResult,
        discounts: discountsResult
      };
    } catch (error) {
      toast.error('Failed to sync promotions and discounts');
      throw error;
    } finally {
      setIsSyncingPromotions(false);
      setIsSyncingDiscounts(false);
    }
  }, [api]);

  return {
    // Promotions
    isLoadingPromotions,
    isDeletingPromotion,
    promotions,
    promotionsTotalItems,
    promotionsTotalPages,
    fetchPromotions,
    getPromotion,
    syncPromotions,
    deletePromotion,
    isSyncingPromotions,
    
    // Discounts
    isLoadingDiscounts,
    isDeletingDiscount,
    discounts,
    discountsTotalItems,
    discountsTotalPages, 
    fetchDiscounts,
    getDiscount,
    syncDiscounts,
    deleteDiscount,
    isSyncingDiscounts,
    
    // Combined operations
    syncAllPromotionsAndDiscounts,
    isInitialized: !!api
  };
};