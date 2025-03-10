// src/hooks/useDeleteGuest.ts
import { useCallback, useState } from 'react';
import { createGuestsApi } from '@/app/api/external/omnigateway/guests';
import { Guest } from "@/app/api/external/omnigateway/types/guests";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useDeleteGuest = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { apiKey } = useGatewayClientApiKey();

  const deleteGuest = useCallback(
    async (
      guest: Guest,
      options: { forceDelete: boolean; deleteUser: boolean }
    ) => {
      if (!apiKey) {
        toast.error('API key not available');
        return;
      }

      try {
        setIsDeleting(true);
        const api = createGuestsApi(apiKey);

        // Extend the API to include a deleteGuest method
        const deleteApi = {
          ...api,
          deleteGuest: async (
            guestId: string,
            options: { forceDelete: boolean; deleteUser: boolean }
          ) => {
            const { data } = await api.api.delete(`/guests/${guestId}`, {
              params: {
                forceDelete: options.forceDelete,
                deleteUser: options.deleteUser,
              },
            });
            return data;
          },
        };

        await deleteApi.deleteGuest(guest._id, options);
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting guest:', error);
        
        // Handle specific error messages from API
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Failed to delete guest');
        }
        
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [apiKey, onSuccess]
  );

  return {
    deleteGuest,
    isDeleting,
  };
};