import { createOmniGateway } from './index';
import { CustomerFormData } from './types/customers';

export const createCustomersApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getCustomers: async (params = {}) => {
            const { data } = await api.get('/customers', { params });
            return data;
        },
        createCustomer: async (customerData: CustomerFormData) => {
            const { data } = await api.post('/customers', customerData);
            return data;
        },
        updateCustomer: async (id: string, customerData: Partial<CustomerFormData>) => {
            const { data } = await api.patch(`/customers/${id}`, customerData);
            return data;
        },
        deactivateCustomer: async (id: string) => {
            const { data } = await api.delete(`/customers/${id}`);
            return data;
        },
        hardDelete: async (id: string) => {
            const { data } = await api.delete(`/customers/${id}/hard`);
            return data;
        }
    };
};