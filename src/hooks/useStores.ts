import { useState, useCallback, useMemo } from 'react';
import { createStoreApi } from '@/app/api/external/omnigateway/store';
import { Store } from "@/app/api/external/omnigateway/types/stores";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useStores = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);
    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createStoreApi(apiKey) : null, [apiKey]);

    const listConnectedStores = useCallback(async () => {
        if (!api) return;
        try {
            setIsLoading(true);
            const data = await api.getConnectedStores();
            setStores(data);
            return data;
        } catch (error) {
            toast.error('Failed to fetch stores');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const connectUser = useCallback(async (storeId: string, userId: string, originalstaffId: string) => {
        if (!api) return;
        try {
            // Connect in OmniGateway
            await api.connectUser(storeId, userId);

            // Update Prisma via API
            await fetch('/api/staff/store-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId: originalstaffId,
                    storeId,
                    action: 'connect'
                })
            });

            toast.success('User connected successfully');
        } catch (error) {
            toast.error('Failed to connect user');
            throw error;
        }
    }, [api]);

    const disconnectUser = useCallback(async (storeId: string, userId: string) => {
        if (!api) return;
        try {
            // Disconnect in OmniGateway
            await api.disconnectUser(storeId, userId);

            // Update Prisma via API
            await fetch('/api/staff/store-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId: userId,
                    storeId,
                    action: 'disconnect'
                })
            });

            toast.success('User disconnected successfully');
        } catch (error) {
            toast.error('Failed to disconnect user');
            throw error;
        }
    }, [api]);

    return {
        isLoading,
        stores,
        listConnectedStores,
        connectUser,
        disconnectUser,
        isInitialized: !!api
    };
};