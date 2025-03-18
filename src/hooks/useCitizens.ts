// hooks/useCitizens.ts
import { useState, useCallback, useMemo } from 'react';
import { createCitizensApi } from '@/app/api/external/omnigateway/citizens';
import { Citizen, CitizenParams } from '@/app/api/external/omnigateway/types/citizens';
import { useGatewayClientApiKey } from '@/hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCitizens = (type: 'all' | 'active' = 'all') => {
    const [isLoading, setIsLoading] = useState(false);
    const [citizens, setCitizens] = useState<Citizen[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createCitizensApi(apiKey) : null, [apiKey]);

    const fetchCitizens = useCallback(async (params: CitizenParams = {}) => {
        if (!api) return;

        setIsLoading(true);
        try {
            // Call different endpoints based on type
            const response = type === 'all' 
                ? await api.getCitizens(params)
                : await api.getActiveReporters(params);
            
            setCitizens(response.data);
            setTotalItems(response.meta.total);
            setCurrentPage(response.meta.page);
            setTotalPages(response.meta.pages);
            
            return response;
        } catch (error) {
            console.error(`Error fetching ${type} citizens:`, error);
            toast.error(`Failed to fetch citizens. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    }, [api, type]);

    const getCitizen = useCallback(async (id: string) => {
        if (!api) return null;

        try {
            return await api.getCitizen(id);
        } catch (error) {
            console.error('Error fetching citizen details:', error);
            toast.error('Failed to fetch citizen details');
            return null;
        }
    }, [api]);

    return {
        isLoading,
        citizens,
        totalItems,
        currentPage,
        totalPages,
        fetchCitizens,
        getCitizen,
        isInitialized: !!api
    };
};