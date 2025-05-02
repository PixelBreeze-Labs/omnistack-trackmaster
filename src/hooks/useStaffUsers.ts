// hooks/useStaffUsers.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackUserApi } from '@/app/api/external/omnigateway/user';
import { 
  StaffUser,
  StaffUserParams,
} from "@/app/api/external/omnigateway/types/users";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useStaffUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackUserApi(apiKey) : null, [apiKey]);

  // Fetch staff users with optional filtering
  const fetchStaffUsers = useCallback(async (params: StaffUserParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getStaffUsers(params);
      setStaffUsers(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch staff users');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Soft delete a user
  const softDeleteUser = useCallback(async (userId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.softDeleteUser(userId);
      toast.success('User deleted successfully');
      return response;
    } catch (error) {
      toast.error('Failed to delete user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  

  return {
    isLoading,
    staffUsers,
    totalItems,
    totalPages,
    fetchStaffUsers,
    softDeleteUser,
    isInitialized: !!api
  };
};