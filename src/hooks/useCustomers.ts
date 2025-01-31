import { useState, useCallback, useMemo } from 'react';
import { createCustomersApi } from '@/app/api/external/omnigateway/customers';
import { Customer, ListCustomersResponse  } from "@/app/api/external/omnigateway/types/customers";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCustomers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createCustomersApi(apiKey) : null, [apiKey]);

    const fetchCustomers = useCallback(async (params = {}) => {
        if (!api) return;

        try {
            setIsLoading(true);
            const response: ListCustomersResponse = await api.getCustomers(params);
            setCustomers(response.items);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        customers,
        totalItems,
        totalPages,
        fetchCustomers,
        isInitialized: !!api
    };
};
