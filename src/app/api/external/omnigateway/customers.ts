import { createOmniGateway } from './index';

export const createCustomersApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getCustomers: async (params = {}) => {
            const { data } = await api.get('/customers', { params });
            return data;
        }
    };
};
