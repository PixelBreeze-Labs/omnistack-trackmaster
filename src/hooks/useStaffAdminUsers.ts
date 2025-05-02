// hooks/useStaffAdminUsers.ts
import { useState, useCallback, useMemo } from 'react';
import { createOmniStackUserApi } from '@/app/api/external/omnigateway/user';
import { 
  StaffUser,
  StaffUserParams,
} from "@/app/api/external/omnigateway/types/users";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useStaffAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [staffAdminUsers, setStaffAdminUsers] = useState<StaffUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackUserApi(apiKey) : null, [apiKey]);

  // Fetch staff admin users with optional filtering
  const fetchStaffAdminUsers = useCallback(async (params: StaffUserParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getStaffAdminUsers(params);
      setStaffAdminUsers(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      toast.error('Failed to fetch staff admin users');
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
    staffAdminUsers,
    totalItems,
    totalPages,
    fetchStaffAdminUsers,
    softDeleteUser,
    isInitialized: !!api
  };
};