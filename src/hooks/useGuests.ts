// src/hooks/useGuests.ts
import { useState, useCallback, useMemo } from 'react';
import { createGuestsApi } from '@/app/api/external/omnigateway/guests';
import { Guest, GuestParams, GuestMetrics } from "@/app/api/external/omnigateway/types/guests";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useGuests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState<GuestMetrics>({
        totalGuests: 0,
        activeGuests: 0,
        guestGrowth: 0,
        trends: {
            guests: { value: 0, percentage: 0 },
            active: { value: 0, percentage: 0 }
        }
    });
    
    const { apiKey, error: apiKeyError } = useGatewayClientApiKey();
    const guestApi = useMemo(() => apiKey ? createGuestsApi(apiKey) : null, [apiKey]);
 
    const fetchGuests = useCallback(async (params: GuestParams = {}) => {
        if (!guestApi) return;
        
        try {
            setIsLoading(true);
            const response = await guestApi.getGuests(params);
            setGuests(response.items || []);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            setMetrics(response.metrics);
            return response;
        } catch (error) {
            console.error('Error fetching guests:', error);
            setGuests([]);
            toast.error('Failed to fetch guests');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [guestApi]);

    const searchGuests = useCallback(async (query: string) => {
        if (!guestApi) return;
        
        try {
            setIsLoading(true);
            const response = await guestApi.searchGuests(query);
            return response.items || [];
        } catch (error) {
            console.error('Error searching guests:', error);
            toast.error('Failed to search guests');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [guestApi]);

    return {
        isLoading,
        guests,
        totalItems,
        totalPages,
        metrics,
        fetchGuests,
        searchGuests,
        apiKeyError,
        isInitialized: !!guestApi,
    };
};