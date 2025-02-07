import { useState, useCallback, useMemo, useEffect } from 'react';
import { ExternalMember } from '@/app/api/external/omnigateway/types/members';
import { createVenueBoostApi } from '@/app/api/external/omnigateway/venueboost/members';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

const initialMetrics = {
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
};

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

const computeMetrics = (response: any): ExternalMemberMetrics => {
  if (response.metrics) {
    const apiMetrics = response.metrics;
    return {
      totalRegistrations: apiMetrics.totalRegistrations,
      conversionRate: apiMetrics.totalRegistrations
        ? (apiMetrics.approvedUsers / apiMetrics.totalRegistrations) * 100
        : 0,
      activeUsers: apiMetrics.approvedUsers,
      recentSignups: apiMetrics.recentSignups,
      trends: {
        monthly: apiMetrics.trends.monthly,
        conversion: apiMetrics.trends.weekly,
        active: apiMetrics.trends.weekly,
        recent: apiMetrics.trends.recent
      }
    };
  }

  const activeCount = response.data.filter((m: ExternalMember) => m.status === 'approved').length;
  const recentCount = response.data.filter((m: ExternalMember) => {
    const date = new Date(m.applied_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo;
  }).length;

  return {
    totalRegistrations: response.total,
    conversionRate: response.total ? (activeCount / response.total) * 100 : 0,
    activeUsers: activeCount,
    recentSignups: recentCount,
    trends: {
      monthly: 0,
      conversion: 0,
      active: 0,
      recent: 0
    }
  };
};

export const useExternalMembers = ({ source }: { source: 'from_my_club' | 'landing_page' }) => {
  const [members, setMembers] = useState<ExternalMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [metrics, setMetrics] = useState<ExternalMemberMetrics>(initialMetrics);

  const { apiKey, loading: keyLoading, error: keyError } = useGatewayClientApiKey();
  
  const api = useMemo(() => {
    if (!apiKey) {
      setLoading(false);
      return null;
    }
    return createVenueBoostApi(apiKey);
  }, [apiKey]);

  const loadData = useCallback(async (params: { search?: string; status?: string }) => {
    if (!api) {
      setLoading(false);
      setMembers([]);
      setTotalCount(0);
      setMetrics(initialMetrics);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getMembers({
        page,
        per_page: pageSize,
        registration_source: source,
        ...params
      });

      setMembers(response.data || []);
      setTotalCount(response.total || 0);
      setMetrics(computeMetrics(response));
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      toast.error('Failed to fetch members');
      setMembers([]);
      setTotalCount(0);
      setMetrics(initialMetrics);
    } finally {
      setLoading(false);
    }
  }, [api, page, pageSize, source]);

  const fetchMembers = useCallback((params: { search?: string; status?: string }) => {
    if (!api) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    loadData(params);
    return () => controller.abort();
  }, [api, loadData]);

  const approveMember = useCallback(async (id: string) => {
    if (!api) return;
    try {
      await api.approveMember(id);
      toast.success('Member approved successfully');
      loadData({});
    } catch (error) {
      toast.error('Failed to approve member');
    }
  }, [api, loadData]);

  const rejectMember = useCallback(async (id: string, reason?: string) => {
    if (!api) return;
    try {
      await api.rejectMember(id, reason);
      toast.success('Member rejected successfully');
      loadData({});
    } catch (error) {
      toast.error('Failed to reject member');
    }
  }, [api, loadData]);

  const exportMembers = useCallback(async () => {
    if (!api) return;
    try {
      const fileData = await api.exportMembers(source);
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'members_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Export initiated successfully');
    } catch (error) {
      toast.error('Failed to export members');
    }
  }, [api, source]);

  useEffect(() => {
    if (!api) {
      setLoading(false);
      setMembers([]);
      setTotalCount(0);
      setMetrics(initialMetrics);
      return;
    }

    if (!keyLoading) {
      loadData({});
    }
  }, [api, keyLoading, loadData]);

  return {
    members,
    loading: keyLoading || loading,
    error: error || keyError,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    metrics,
    fetchMembers,
    approveMember,
    rejectMember,
    exportMembers
  };
};