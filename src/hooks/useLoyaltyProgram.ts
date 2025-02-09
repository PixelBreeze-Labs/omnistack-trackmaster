// hooks/useLoyaltyProgram.ts
import { useState, useCallback, useMemo } from 'react';
import { createLoyaltyProgramApi } from '@/app/api/external/omnigateway/loyalty';
import { LoyaltyProgram, UpdateLoyaltyProgramDto } from "@/app/api/external/omnigateway/types/loyalty-program";
import { BonusDayDto, UpdatePointsSystemDto } from "@/app/api/external/omnigateway/types/points-system";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useLoyaltyProgram = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<LoyaltyProgram | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createLoyaltyProgramApi(apiKey) : null, [apiKey]);

    const fetchProgram = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.getLoyaltyProgram();
            setProgram(response);
            return response;
        } catch (error) {
            console.error('Error fetching loyalty program:', error);
            toast.error('Failed to fetch loyalty program');
            setError('Failed to fetch loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateProgram = useCallback(async (data: UpdateLoyaltyProgramDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.updateLoyaltyProgram(data);
            toast.success('Loyalty program updated successfully');
            await fetchProgram(); // Refresh data
            return response;
        } catch (error) {
            console.error('Error updating loyalty program:', error);
            toast.error('Failed to update loyalty program');
            setError('Failed to update loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchProgram]);

    const disableProgram = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            await api.disableLoyaltyProgram();
            setProgram(null);
            toast.success('Loyalty program disabled successfully');
        } catch (error) {
            console.error('Error disabling loyalty program:', error);
            toast.error('Failed to disable loyalty program');
            setError('Failed to disable loyalty program');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    // New points-related methods
    const updatePointsSystem = useCallback(async (data: UpdatePointsSystemDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.updatePointsSystem(data);
            toast.success('Points system updated successfully');
            await fetchProgram(); // Refresh data
            return response;
        } catch (error) {
            console.error('Error updating points system:', error);
            toast.error('Failed to update points system');
            setError('Failed to update points system');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchProgram]);

    const addBonusDay = useCallback(async (data: BonusDayDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.addBonusDay(data);
            toast.success('Bonus day added successfully');
            await fetchProgram(); // Refresh data
            return response;
        } catch (error) {
            console.error('Error adding bonus day:', error);
            toast.error('Failed to add bonus day');
            setError('Failed to add bonus day');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchProgram]);

    const removeBonusDay = useCallback(async (id: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.removeBonusDay(id);
            toast.success('Bonus day removed successfully');
            await fetchProgram(); // Refresh data
            return response;
        } catch (error) {
            console.error('Error removing bonus day:', error);
            toast.error('Failed to remove bonus day');
            setError('Failed to remove bonus day');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api, fetchProgram]);

    return {
        isLoading,
        program,
        error,
        fetchProgram,
        updateProgram,
        disableProgram,
        updatePointsSystem,
        addBonusDay,
        removeBonusDay,
        isInitialized: !!api
    };
};