// hooks/usePointsSystem.ts
import { useState, useCallback, useMemo } from 'react';
import { createPointsSystemApi } from '@/app/api/external/omnigateway/points';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { PointsSystem, UpdatePointsSystemDto } from '@/app/api/external/omnigateway/types/points-system';
import toast from 'react-hot-toast';

export const usePointsSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pointsSystem, setPointsSystem] = useState<PointsSystem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createPointsSystemApi(apiKey) : null, [apiKey]);

  const fetchPointsSystem = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getPointsSystem();
      setPointsSystem(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching points system:', err);
      setError('Failed to fetch points system');
      toast.error('Failed to fetch points system');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updatePointsSystem = useCallback(async (data: UpdatePointsSystemDto) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updatePointsSystem(data);
      setPointsSystem(response);
      toast.success('Points system updated successfully');
      setError(null);
    } catch (err) {
      console.error('Error updating points system:', err);
      setError('Failed to update points system');
      toast.error('Failed to update points system');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const manageBonusDay = useCallback(async (
    action: 'add' | 'remove',
    data?: any,
    bonusDayId?: string
  ) => {
    if (!api) return;
    try {
      setIsLoading(true);
      if (action === 'add') {
        await api.addBonusDay(data);
        toast.success('Bonus day added successfully');
      } else {
        await api.removeBonusDay(bonusDayId!);
        toast.success('Bonus day removed successfully');
      }
      await fetchPointsSystem();
    } catch (err) {
      console.error(`Error ${action}ing bonus day:`, err);
      toast.error(`Failed to ${action} bonus day`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchPointsSystem]);

  return {
    isLoading,
    pointsSystem,
    error,
    fetchPointsSystem,
    updatePointsSystem,
    addBonusDay: (data: any) => manageBonusDay('add', data),
    removeBonusDay: (id: string) => manageBonusDay('remove', undefined, id)
  };
};