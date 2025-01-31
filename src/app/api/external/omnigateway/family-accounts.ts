// app/api/external/omnigateway/family-accounts.ts
import { createOmniGateway } from './index';

export const createFamilyAccountsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getFamilyAccounts: async (params = {}) => {
            const { data } = await api.get('/family-accounts', { params });
            return data;
        }
    };
};