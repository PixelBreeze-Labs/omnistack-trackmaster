// app/api/external/omnigateway/loyalty.ts
import { createOmniGateway } from './index';
import { LoyaltyProgram, UpdateLoyaltyProgramDto } from './types/loyalty-program';

export const createLoyaltyProgramApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getLoyaltyProgram: async () => {
            const { data } = await api.get('/loyalty');
            return data as LoyaltyProgram;
        },
        
        updateLoyaltyProgram: async (programData: UpdateLoyaltyProgramDto) => {
            const { data } = await api.put('/loyalty', programData);
            return data;
        },
        
        disableLoyaltyProgram: async () => {
            const { data } = await api.delete('/loyalty');
            return data;
        }
    };
};