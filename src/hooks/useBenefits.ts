// hooks/useBenefits.ts
import { useState, useCallback, useMemo } from 'react';
import { createBenefitsApi } from '@/app/api/external/omnigateway/benefits';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export interface Benefit {
    _id: string;
    name: string;
    description: string;
    type: 'DISCOUNT' | 'CASHBACK' | 'POINTS' | 'FREE_SHIPPING';
    value: number;
    isActive: boolean;
}

export interface CreateBenefitDto {
    name: string;
    description: string;
    type: 'DISCOUNT' | 'CASHBACK' | 'POINTS' | 'FREE_SHIPPING';
    value: number;
}

// hooks/useBenefits.ts
export const useBenefits = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    
    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createBenefitsApi(apiKey) : null, [apiKey]);

    const fetchBenefits = useCallback(async (tier?: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getBenefits(tier);
            setBenefits(response);
            return response;
        } catch (error) {
            console.error('Error fetching benefits:', error);
            toast.error('Failed to fetch benefits');
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const manageBenefit = useCallback(async (
        action: 'create' | 'update' | 'toggle' | 'assignToTier' | 'removeFromTier',
        data: any,
        benefitId?: string,
        tierId?: string
    ) => {
        if (!api) return;
        try {
            setIsLoading(true);
            let response;

            switch (action) {
                case 'create':
                    response = await api.createBenefit(data);
                    break;
                case 'update':
                    response = await api.updateBenefit(benefitId!, data);
                    break;
                case 'toggle':
                    response = await api.toggleBenefit(benefitId!, data.isActive);
                    break;
                case 'assignToTier':
                    response = await api.assignBenefitToTier(benefitId!, tierId!);
                    break;
                case 'removeFromTier':
                    response = await api.removeBenefitFromTier(benefitId!, tierId!);
                    break;
            }

            toast.success(`Benefit ${action} successful`);
            await fetchBenefits();
            return response;
        } catch (error) {
            console.error(`Error ${action} benefit:`, error);
            toast.error(`Failed to ${action} benefit`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchBenefits]);

    return {
        isLoading,
        benefits,
        fetchBenefits,
        createBenefit: (data: CreateBenefitDto) => manageBenefit('create', data),
        updateBenefit: (id: string, data: Partial<CreateBenefitDto>) => 
            manageBenefit('update', data, id),
        toggleBenefit: (id: string, isActive: boolean) => 
            manageBenefit('toggle', { isActive }, id),
        assignBenefitToTier: (benefitId: string, tierId: string) => 
            manageBenefit('assignToTier', null, benefitId, tierId),
        removeFromTier: (benefitId: string, tierId: string) => 
            manageBenefit('removeFromTier', null, benefitId, tierId)
    };
};