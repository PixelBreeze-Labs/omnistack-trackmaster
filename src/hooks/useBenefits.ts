// hooks/useBenefits.ts
import { useState, useCallback, useMemo } from 'react';
import { createBenefitsApi } from '@/app/api/external/omnigateway/benefits';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export interface Benefit {
    id: string;
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

export const useBenefits = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    
    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createBenefitsApi(apiKey) : null, [apiKey]);

    const fetchBenefits = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getBenefits();
            setBenefits(response);
        } catch (error) {
            console.error('Error fetching benefits:', error);
            toast.error('Failed to fetch benefits');
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createBenefit = useCallback(async (data: CreateBenefitDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.createBenefit(data);
            toast.success('Benefit created successfully');
            await fetchBenefits(); // Refresh list
            return response;
        } catch (error) {
            console.error('Error creating benefit:', error);
            toast.error('Failed to create benefit');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchBenefits]);

    const updateBenefit = useCallback(async (id: string, data: Partial<CreateBenefitDto>) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateBenefit(id, data);
            toast.success('Benefit updated successfully');
            await fetchBenefits(); // Refresh list
            return response;
        } catch (error) {
            console.error('Error updating benefit:', error);
            toast.error('Failed to update benefit');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchBenefits]);

    const toggleBenefit = useCallback(async (id: string, isActive: boolean) => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.updateBenefit(id, { isActive });
            toast.success(`Benefit ${isActive ? 'activated' : 'deactivated'} successfully`);
            await fetchBenefits(); // Refresh list
        } catch (error) {
            console.error('Error toggling benefit:', error);
            toast.error('Failed to toggle benefit');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchBenefits]);

    return {
        isLoading,
        benefits,
        fetchBenefits,
        createBenefit,
        updateBenefit,
        toggleBenefit
    };
};