// app/api/external/omnigateway/citizens.ts
import { createOmniGateway } from './index';
import { Citizen, CitizenParams } from './types/citizens';

export const createCitizensApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        // Get all citizens with nextJsUserId
        getCitizens: async (params: CitizenParams = {}) => {
            const { data } = await api.get('/users/with-nextjs-id', { params });
            return data;
        },
        
        // Get all citizens with multiple active reports
        getActiveReporters: async (params: CitizenParams = {}) => {
            const { data } = await api.get('/users/with-multiple-reports', { params });
            return data;
        },
        
        // Get a single citizen by ID
        getCitizen: async (id: string) => {
            const { data } = await api.get(`/users/${id}`);
            return data;
        }
    };
};
