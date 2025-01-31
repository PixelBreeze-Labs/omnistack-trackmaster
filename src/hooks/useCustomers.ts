import { useState, useCallback, useMemo, useEffect } from 'react';
import { createCustomersApi } from '@/app/api/external/omnigateway/customers';
import { Customer, CustomerParams  } from "@/app/api/external/omnigateway/types/customers";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useCustomers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState({
      totalCustomers: 0,
      activeCustomers: 0,
      averageOrderValue: 0,
      customerGrowth: 0,
      trends: {
        customers: { value: 0, percentage: 12 },
        active: { value: 0, percentage: 5 },
        orderValue: { value: 0, percentage: 8 },
        growth: { value: 0, percentage: 15 }
      }
    });
    
    const { apiKey, error: apiKeyError } = useGatewayClientApiKey();
    const customerApi = useMemo(() => apiKey ? createCustomersApi(apiKey) : null, [apiKey]);
 
    const fetchCustomers = useCallback(async (params: CustomerParams = {}) => {
        if (!customerApi) return;
        
        try {
            setIsLoading(true);
            const response = await customerApi.getCustomers(params);
            setCustomers(response.items || []);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            setMetrics(response.metrics);
            return response;
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
            if (customerApi) {
                toast.error('Failed to fetch customers');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [customerApi]);
 

    return {
        isLoading,
        customers,
        totalItems,
        totalPages,
        metrics,
        fetchCustomers,
        apiKeyError,
        isInitialized: !!customerApi,
    };
};