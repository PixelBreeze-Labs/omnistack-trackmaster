// hooks/useRentalUnits.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackPropertyApi } from '@/app/api/external/omnigateway/property';
import { 
  RentalUnit,
  RentalUnitParams,
} from "@/app/api/external/omnigateway/types/properties";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useRentalUnits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackPropertyApi(apiKey) : null, [apiKey]);

  // Fetch rental units with optional filtering
  const fetchRentalUnits = useCallback(async (params: RentalUnitParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getRentalUnits(params);
      setRentalUnits(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      return response;
    } catch (error) {
      toast.error('Failed to fetch rental units');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Sync properties from VenueBoost
  const syncRentalUnits = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.syncRentalUnits();
      toast.success('Rental units synced successfully');
      return response;
    } catch (error) {
      toast.error('Failed to sync rental units');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    rentalUnits,
    totalItems,
    totalPages,
    fetchRentalUnits,
    syncRentalUnits,
    isInitialized: !!api
  };
};