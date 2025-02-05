import { useState, useCallback, useMemo } from "react";
import { createVenueBoostFeedbackApi, VenueBoostFeedbackResponse, Feedback } from "@/app/api/external/omnigateway/venueboost/feedback";
import { useGatewayClientApiKey } from "./useGatewayClientApiKey";
import toast from "react-hot-toast";

export const useCustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => createVenueBoostFeedbackApi(apiKey), [apiKey]);

  const loadData = useCallback(async (params: { search?: string; status?: string } = {}) => {
    try {
      setLoading(true);
      const response: VenueBoostFeedbackResponse = await api.getFeedback({
        page,
        per_page: pageSize,
        ...params,
      });
      setFeedbacks(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError("Failed to fetch feedback");
      toast.error("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  }, [api, page, pageSize]);

  const fetchFeedback = useCallback((params: { search?: string; status?: string } = {}) => {
    loadData(params);
  }, [loadData]);

  const getFeedbackById = useCallback(async (id: string) => {
    try {
      const data = await api.getFeedbackById(id);
      return data;
    } catch (err) {
      toast.error("Failed to fetch feedback detail");
      throw err;
    }
  }, [api]);

  return {
    feedbacks,
    loading,
    error,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    fetchFeedback,
    getFeedbackById,
  };
};
