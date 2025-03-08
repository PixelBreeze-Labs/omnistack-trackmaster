// src/app/api/external/omnigateway/guests.ts
import { createOmniGateway } from './index';
import { GuestParams } from './types/guests';

export const createGuestsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getGuests: async (params: GuestParams = {}) => {
            const { data } = await api.get('/guests', { params });
            return data;
        },
        searchGuests: async (query: string) => {
            const { data } = await api.get('/guests/search', { params: { query } });
            return data;
        }
    };
};