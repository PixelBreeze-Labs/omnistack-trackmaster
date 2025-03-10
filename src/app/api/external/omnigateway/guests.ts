// src/app/api/external/omnigateway/guests.ts
import { createOmniGateway } from './index';
import { GuestParams } from './types/guests';

export const createGuestsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        api, // Expose the base API for custom requests
        
        getGuests: async (params: GuestParams = {}) => {
            const { data } = await api.get('/guests', { params });
            return data;
        },
        
        searchGuests: async (query: string) => {
            const { data } = await api.get('/guests/search', { params: { query } });
            return data;
        },
        
        deleteGuest: async (guestId: string, options: { forceDelete?: boolean; deleteUser?: boolean } = {}) => {
            const { data } = await api.delete(`/guests/${guestId}`, {
                params: {
                    forceDelete: options.forceDelete || false,
                    deleteUser: options.deleteUser || false
                }
            });
            return data;
        }
    };
};