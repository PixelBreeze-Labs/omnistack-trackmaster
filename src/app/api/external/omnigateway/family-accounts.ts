// app/api/external/omnigateway/family-accounts.ts
import { createOmniGateway } from './index';
import { AxiosError } from 'axios';
import { 
    Customer,
    FamilyAccount,
    FamilyStats,
    FamilyAccountsResponse,
    LinkFamilyPayload,
    UpdateFamilyPayload
 } from "@/app/api/external/omnigateway/types/family-account";

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public originalError?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const createFamilyAccountsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    const handleApiError = (error: AxiosError): never => {
        const statusCode = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        throw new ApiError(statusCode, message, error);
    };

    return {
        getFamilyAccounts: async (params = {}): Promise<FamilyAccountsResponse> => {
            try {
                const { data } = await api.get('/family-accounts', { params });
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },
        
        searchCustomers: async (query: string): Promise<Customer[]> => {
            try {
                const { data } = await api.get('/customers/search', { 
                    params: { 
                        query,
                        excludeFamilyMembers: true
                     } 
                });
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        linkFamily: async (payload: LinkFamilyPayload): Promise<FamilyAccount> => {
            try {
                const { data } = await api.post('/family-accounts', payload);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        unlinkMember: async (familyId: string, memberId: string): Promise<FamilyAccount> => {
            try {
                const { data } = await api.delete(`/family-accounts/${familyId}/members/${memberId}`);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        updateFamily: async (id: string, payload: UpdateFamilyPayload): Promise<FamilyAccount> => {
            try {
                const { data } = await api.put(`/family-accounts/${id}`, payload);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        getFamilyDetails: async (id: string): Promise<FamilyAccount> => {
            try {
                const { data } = await api.get(`/family-accounts/${id}`);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        getCustomerFamilies: async (customerId: string): Promise<FamilyAccount[]> => {
            try {
                const { data } = await api.get(`/customers/${customerId}/families`);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        },

        getFamilyStats: async (id: string): Promise<FamilyStats> => {
            try {
                const { data } = await api.get(`/family-accounts/${id}/stats`);
                return data;
            } catch (error) {
                return handleApiError(error as AxiosError);
            }
        }
    };
};