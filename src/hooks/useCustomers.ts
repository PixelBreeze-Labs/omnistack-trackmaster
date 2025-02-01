import { useState, useCallback, useMemo } from 'react';
import { createCustomersApi } from '@/app/api/external/omnigateway/customers';
import { Customer, CustomerFormData, CustomerParams  } from "@/app/api/external/omnigateway/types/customers";
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
            toast.error('Failed to fetch customers');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [customerApi]);

    const createCustomer = useCallback(async (data: CustomerFormData) => {
        if (!customerApi) return;
        
        try {
            setIsLoading(true);
            const response = await customerApi.createCustomer(data);
            toast.success('Customer created successfully');
            return response;
        } catch (error) {
            console.error('Error creating customer:', error);
            toast.error('Failed to create customer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [customerApi]);

    const updateCustomer = useCallback(async (id: string, data: Partial<CustomerFormData>) => {
        if (!customerApi) return;
        
        try {
            setIsLoading(true);
            const response = await customerApi.updateCustomer(id, data);
            return response;
        } catch (error) {
            // handled in modal
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [customerApi]);

    const deleteCustomer = useCallback(async (id: string) => {
        if (!customerApi) return;
        
        try {
            setIsLoading(true);
            const response = await customerApi.hardDelete(id);
            toast.success('Customer deleted successfully');
            return response;
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [customerApi]);

    const deactivateCustomer = useCallback(async (id: string) => {
        if (!customerApi) return;
        
        try {
            setIsLoading(true);
            const response = await customerApi.deactivateCustomer(id);
            toast.success('Customer deactivated successfully');
            return response;
        } catch (error) {
            console.error('Error deactivating customer:', error);
            toast.error('Failed to deactivate customer');
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
        createCustomer,
        updateCustomer,
        deleteCustomer,
        deactivateCustomer,
        apiKeyError,
        isInitialized: !!customerApi,
    };
};