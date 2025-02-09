// app/api/external/omnigateway/benefits.ts
import { createOmniGateway } from './index';
import { Benefit, CreateBenefitDto } from '@/hooks/useBenefits';

export const createBenefitsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getBenefits: async () => {
            const { data } = await api.get('/benefits');
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

        deleteBenefit: async (id: string) => {
            const { data } = await api.delete(`/benefits/${id}`);
            return data;
        }
    };
};