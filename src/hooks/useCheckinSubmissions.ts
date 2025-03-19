// hooks/useCheckinSubmissions.ts
import { useState, useCallback, useMemo } from 'react';
import { createCheckinFormsApi } from '@/app/api/external/omnigateway/checkin-forms';
import { 
  CheckinSubmission, 
  CheckinSubmissionParams 
} from "@/app/api/external/omnigateway/types/checkin-forms";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCheckinSubmissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<CheckinSubmission[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createCheckinFormsApi(apiKey) : null, [apiKey]);

  const fetchSubmissions = useCallback(async (params: CheckinSubmissionParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getSubmissions(params);
      setSubmissions(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const fetchFormSubmissions = useCallback(async (formConfigId: string, params: CheckinSubmissionParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getFormSubmissions(formConfigId, params);
      
      // Check response structure and handle appropriately
      if (response.data) {
        setSubmissions(response.data);
        if (response.pagination) {
          setTotalItems(response.pagination.total);
          setTotalPages(response.pagination.totalPages);
        }
      } else if (response.items) {
        setSubmissions(response.items);
        setTotalItems(response.total);
        setTotalPages(response.pages);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      toast.error('Failed to fetch form submissions');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateSubmissionStatus = useCallback(async (id: string, status: string, verificationData?: Record<string, any>) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateSubmissionStatus(id, status, verificationData);
      toast.success('Submission status updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update submission status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const deleteSubmission = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      await api.deleteSubmission(id);
      toast.success('Submission deleted successfully');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const getSubmission = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getSubmission(id);
      return response;
    } catch (error) {
      console.error('Error fetching submission:', error);
      toast.error('Failed to fetch submission');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    submissions,
    totalItems,
    totalPages,
    fetchSubmissions,
    fetchFormSubmissions,
    updateSubmissionStatus,
    deleteSubmission,
    getSubmission,
    isInitialized: !!api
  };
};