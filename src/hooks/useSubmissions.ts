// hooks/useSubmissions.ts
import { useState, useCallback, useMemo } from 'react';
import { createSubmissionsApi } from '@/app/api/external/omnigateway/submissions';
import { Submission, SubmissionParams } from '@/app/api/external/omnigateway/types/submissions';
import { useGatewayClientApiKey } from '@/hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useSubmissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createSubmissionsApi(apiKey) : null, [apiKey]);

  const fetchSubmissions = useCallback(async (params: SubmissionParams = {}) => {
    if (!api) return;

    setIsLoading(true);
    try {
      const response = await api.getSubmissions(params);
      
      setSubmissions(response.items);
      setTotalItems(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.pages);
      
      return response;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateSubmissionStatus = useCallback(async (id: string, status: string) => {
    if (!api) return;

    try {
      await api.updateSubmission(id, { status });
      toast.success(`The submission has been marked as ${status}.`);
      return true;
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update status. Please try again.');
      return false;
    }
  }, [api]);

  return {
    isLoading,
    submissions,
    totalItems,
    currentPage,
    totalPages,
    fetchSubmissions,
    updateSubmissionStatus,
    isInitialized: !!api
  };
};