// hooks/useLoyaltyProgram.ts
import { useState, useCallback, useMemo } from 'react';
import { createLoyaltyProgramApi } from '@/app/api/external/omnigateway/loyalty';
import { LoyaltyProgram, UpdateLoyaltyProgramDto } from "@/app/api/external/omnigateway/types/loyalty-program";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useLoyaltyProgram = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<LoyaltyProgram | null>(null);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createLoyaltyProgramApi(apiKey) : null, [apiKey]);

    const fetchProgram = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getLoyaltyProgram();
            setProgram(response);
            return response;
        } catch (error) {
            console.error('Error fetching loyalty program:', error);
            toast.error('Failed to fetch loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateProgram = useCallback(async (data: UpdateLoyaltyProgramDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateLoyaltyProgram(data);
            toast.success('Loyalty program updated successfully');
            return response;
        } catch (error) {
            console.error('Error updating loyalty program:', error);
            toast.error('Failed to update loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const disableProgram = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.disableLoyaltyProgram();
            setProgram(null);
            toast.success('Loyalty program disabled successfully');
        } catch (error) {
            console.error('Error disabling loyalty program:', error);
            toast.error('Failed to disable loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        program,
        fetchProgram,
        updateProgram,
        disableProgram,
        isInitialized: !!api
    };
};