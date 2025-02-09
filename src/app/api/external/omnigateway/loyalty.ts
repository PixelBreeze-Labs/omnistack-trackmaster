// app/api/external/omnigateway/loyalty.ts
import { createOmniGateway } from './index';
import { LoyaltyProgram, UpdateLoyaltyProgramDto } from './types/loyalty-program';
import { BonusDayDto } from './types/points-system';
import { UpdatePointsSystemDto } from './types/points-system';

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
        },

        updatePointsSystem: async (data: UpdatePointsSystemDto) => {
            const response = await api.put('/loyalty/points', data);
            return response.data;
        },
        addBonusDay: async (data: BonusDayDto) => {
            const response = await api.post('/loyalty/points/bonus-days', data);
            return response.data;
        },
        removeBonusDay: async (id: string) => {
            const response = await api.delete(`/loyalty/points/bonus-days/${id}`);
            return response.data;
        }
    };
};