import { useState, useCallback, useMemo, useEffect } from "react";
import { createVenueBoostFeedbackApi, VenueBoostFeedbackResponse, Feedback } from "@/app/api/external/omnigateway/venueboost/feedback";
import { useGatewayClientApiKey } from "./useGatewayClientApiKey";
import toast from "react-hot-toast";

export const useCustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);

  const { apiKey, loading: keyLoading } = useGatewayClientApiKey();
  
  const api = useMemo(() => {
    if (!apiKey) {
      setLoading(false);
      return null;
    }
    return createVenueBoostFeedbackApi(apiKey);
  }, [apiKey]);

  const loadData = useCallback(async (params: { search?: string; store?: string } = {}) => {
    if (!api) {
      setLoading(false);
      setFeedbacks([]);
      setFilteredFeedbacks([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      const response: VenueBoostFeedbackResponse = await api.getFeedback({
        page,
        per_page: pageSize,
        search: params.search,
      });

      const data = response.data || [];
      setFeedbacks(data);
      
      // Apply store filter on frontend
      const filtered = params.store 
        ? data.filter(f => f.store.name.toLowerCase().includes(params.store?.toLowerCase() || ''))
        : data;
      
      setFilteredFeedbacks(filtered);
      setTotalCount(filtered.length);
      setIsInitialized(true);
    } catch (err) {
      setError("Failed to fetch feedback");
      toast.error("Failed to fetch feedback");
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, [api, page, pageSize]);

  const fetchFeedback = useCallback((params: { search?: string; store?: string } = {}) => {
    if (!api) {
      setLoading(false);
      return;
    }
    loadData(params);
  }, [api, loadData]);

  useEffect(() => {
    if (!api) {
      setLoading(false);
      setFeedbacks([]);
      setFilteredFeedbacks([]);
      setTotalCount(0);
      return;
    }

    if (!keyLoading) {
      loadData({});
    }
  }, [api, keyLoading, loadData]);

  return {
    feedbacks: filteredFeedbacks,
    loading: loading || keyLoading,
    error,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    isInitialized,
    fetchFeedback
  };
};