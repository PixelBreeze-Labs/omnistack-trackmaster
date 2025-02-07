import { createOmniGateway } from './index';

export const createStoreApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);
    return {
        getConnectedStores: async () => {
            const { data } = await api.get('/stores/connected');
            return data;
        },
        connectUser: async (storeId: string, userId: string) => {
            const { data } = await api.post(`/stores/${storeId}/connect-user`, { userId });
            return data;
        },
        disconnectUser: async (storeId: string, userId: string) => {
            const { data } = await api.post(`/stores/${storeId}/disconnect-user`, { userId });
            return data;
        }
    };
};
