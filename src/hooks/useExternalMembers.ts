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
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<ExternalMember[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [metrics, setMetrics] = useState({
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { apiKey, error: apiKeyError } = useGatewayClientApiKey();
  const memberApi = useMemo(() => apiKey ? createVenueBoostApi(apiKey) : null, [apiKey]);

  const fetchMembers = useCallback(async (params: { search?: string; status?: string } = {}) => {
      if (!memberApi) return;
      
      try {
          setIsLoading(true);
          const response = await memberApi.getMembers({
              page,
              per_page: pageSize,
              registration_source: source,
              ...params
          });
          
          setMembers(response.data || []);
          setTotalCount(response.total);
          
          if (response.metrics) {
              setMetrics(response.metrics);
          }
      } catch (error) {
          console.error('Error fetching members:', error);
          setMembers([]);
          toast.error('Failed to fetch members');
      } finally {
          setIsLoading(false);
      }
  }, [memberApi, page, pageSize, source]);

  const approveMember = useCallback(async (id: string) => {
      if (!memberApi) return;
      try {
          await memberApi.approveMember(id);
          toast.success('Member approved successfully');
          return true;
      } catch (error) {
          toast.error('Failed to approve member');
          throw error;
      }
  }, [memberApi]);

  return {
      isLoading,
      members,
      totalCount,
      metrics,
      page,
      setPage,
      pageSize,
      setPageSize,
      fetchMembers,
      approveMember,
      rejectMember,
      exportMembers,
      apiKeyError,
      isInitialized: !!memberApi
  };
};
