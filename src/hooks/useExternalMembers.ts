// hooks/useExternalMembers.ts
import { useState, useCallback, useMemo } from 'react';
import { ExternalMember } from '@/app/api/external/omnigateway/types/members';
import { createVenueBoostApi } from '@/app/api/external/omnigateway/venueboost/members';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export interface ExternalMemberMetrics {
  totalRegistrations: number;
  conversionRate: number;
  activeUsers: number;
  recentSignups: number;
  trends: {
    monthly: number;
    conversion: number;
    active: number;
    recent: number;
  };
}

export const useExternalMembers = ({ source }: { source: 'from_my_club' | 'landing_page' }) => {
  const [members, setMembers] = useState<ExternalMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [metrics, setMetrics] = useState<ExternalMemberMetrics>({
    totalRegistrations: 0,
    conversionRate: 0,
    activeUsers: 0,
    recentSignups: 0,
    trends: {
      monthly: 0,
      conversion: 0,
      active: 0,
      recent: 0
    }
  });

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => createVenueBoostApi(apiKey), [apiKey]);

  const loadData = useCallback(async (params: { search?: string; status?: string }) => {
    try {
      setLoading(true);
      const response = await api.getMembers({
        page,
        per_page: pageSize,
        registration_source: source,
        ...params
      });

      setMembers(response.data);
      setTotalCount(response.total);
      
      // Calculate metrics from response data
      const activeCount = response.data.filter(m => m.status === 'approved').length;
      const recentCount = response.data.filter(m => {
        const date = new Date(m.applied_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      }).length;

      setMetrics({
        totalRegistrations: response.total,
        conversionRate: (activeCount / response.total) * 100,
        activeUsers: activeCount,
        recentSignups: recentCount,
        trends: response.metrics?.trends || {
          monthly: 0,
          conversion: 0,
          active: 0,
          recent: 0
        }
      });
    } catch (err) {
      setError('Failed to fetch members');
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [api, page, pageSize, source]);

  const fetchMembers = useCallback((params: { search?: string; status?: string }) => {
    const controller = new AbortController();
    loadData(params);
    return () => controller.abort();
  }, [loadData]);

  return {
    members,
    loading,
    error,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    metrics,
    fetchMembers
  };
};