// hooks/useCheckinForms.ts
import { useState, useCallback, useMemo } from 'react';
import { createCheckinFormsApi } from '@/app/api/external/omnigateway/checkin-forms';
import { 
  CheckinFormConfig, 
  CheckinFormMetrics, 
  CreateCheckinFormConfigDto, 
  UpdateCheckinFormConfigDto, 
  CheckinFormParams 
} from "@/app/api/external/omnigateway/types/checkin-forms";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCheckinForms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forms, setForms] = useState<CheckinFormConfig[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [metrics, setMetrics] = useState<CheckinFormMetrics>({
    totalForms: 0,
    activeForms: 0,
    views: 0,
    submissions: 0,
    submissionRate: 0,
    trends: {
      forms: { value: 0, percentage: 0 },
      views: { value: 0, percentage: 0 },
      submissions: { value: 0, percentage: 0 }
    }
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createCheckinFormsApi(apiKey) : null, [apiKey]);

  const fetchForms = useCallback(async (params: CheckinFormParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getCheckinForms(params);
      setForms(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setMetrics(response.metrics);
      return response;
    } catch (error) {
      console.error('Error fetching check-in forms:', error);
      toast.error('Failed to fetch check-in forms');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const createForm = useCallback(async (data: CreateCheckinFormConfigDto) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.createCheckinForm(data);
      toast.success('Check-in form created successfully');
      return response;
    } catch (error) {
      console.error('Error creating check-in form:', error);
      toast.error('Failed to create check-in form');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateForm = useCallback(async (shortCode: string, data: UpdateCheckinFormConfigDto) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateCheckinForm(shortCode, data);
      toast.success('Check-in form updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating check-in form:', error);
      toast.error('Failed to update check-in form');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const deleteForm = useCallback(async (shortCode: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      await api.deleteCheckinForm(shortCode);
      toast.success('Check-in form deleted successfully');
    } catch (error) {
      console.error('Error deleting check-in form:', error);
      toast.error('Failed to delete check-in form');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const getForm = useCallback(async (shortCode: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getCheckinForm(shortCode);
      return response;
    } catch (error) {
      console.error('Error fetching check-in form:', error);
      toast.error('Failed to fetch check-in form');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    forms,
    totalItems,
    totalPages,
    metrics,
    fetchForms,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    isInitialized: !!api
  };
};

