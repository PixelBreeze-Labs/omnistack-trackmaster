import { useState, useCallback, useMemo } from "react";
import { createVenueBoostFeedbackApi, FeedbackStatsResponse } from "@/app/api/external/omnigateway/venueboost/feedback";
import { useGatewayClientApiKey } from "./useGatewayClientApiKey";
import toast from "react-hot-toast";

export const useFeedbackStats = () => {
  const [stats, setStats] = useState<FeedbackStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => createVenueBoostFeedbackApi(apiKey), [apiKey]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFeedbackStats(
      );
      setStats(data);
    } catch (err) {
      setError("Failed to fetch feedback stats");
      toast.error("Failed to fetch feedback stats");
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { stats, loading, error, fetchStats };
};
