// app/api/external/omnigateway/benefits.ts
import { createOmniGateway } from './index';
import { Benefit, CreateBenefitDto } from '@/hooks/useBenefits';

// app/api/external/omnigateway/benefits.ts
export const createBenefitsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getBenefits: async (tier?: string) => {
            const params = tier ? { tier } : {};
            const { data } = await api.get('/benefits', { params });
            return data as Benefit[];
        },

        createBenefit: async (benefitData: CreateBenefitDto) => {
            const { data } = await api.post('/benefits', benefitData);
            return data as Benefit;
        },

        updateBenefit: async (id: string, benefitData: Partial<CreateBenefitDto>) => {
            const { data } = await api.put(`/benefits/${id}`, benefitData);
            return data as Benefit;
        },

        toggleBenefit: async (id: string, isActive: boolean) => {
            if (!id) {
                throw new Error('Benefit ID is required');
            }
            const { data } = await api.put(`/benefits/${id}/toggle`, { isActive }); // Send isActive in request body
            return data;
        },

        assignBenefitToTier: async (benefitId: string, tierId: string) => {
            const { data } = await api.put(`/benefits/${benefitId}/tier/${tierId}`);
            return data as Benefit;
        },

        removeBenefitFromTier: async (benefitId: string, tierId: string) => {
            const { data } = await api.delete(`/benefits/${benefitId}/tier/${tierId}`);
            return data as Benefit;
        }
    };
};