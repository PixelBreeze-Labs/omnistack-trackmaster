// hooks/useOperatingEntities.ts
import { useState, useCallback, useMemo } from 'react';
import { createOperatingEntitiesApi } from '@/app/api/external/omnigateway/operating-entities';
import { OperatingEntity, CreateOperatingEntityDto, UpdateOperatingEntityDto, OperatingEntityParams } from "@/app/api/external/omnigateway/types/operating-entities";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useOperatingEntities = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [operatingEntities, setOperatingEntities] = useState<OperatingEntity[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createOperatingEntitiesApi(apiKey) : null, [apiKey]);

    const fetchOperatingEntities = useCallback(async (params: OperatingEntityParams = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getOperatingEntities(params);
            setOperatingEntities(response.items);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            console.error('Error fetching operating entities:', error);
            toast.error('Failed to fetch operating entities');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createOperatingEntity = useCallback(async (data: CreateOperatingEntityDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.createOperatingEntity(data);
            toast.success('Operating entity created successfully');
            return response;
        } catch (error) {
            console.error('Error creating operating entity:', error);
            toast.error('Failed to create operating entity');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateOperatingEntity = useCallback(async (id: string, data: UpdateOperatingEntityDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateOperatingEntity(id, data);
            toast.success('Operating entity updated successfully');
            return response;
        } catch (error) {
            console.error('Error updating operating entity:', error);
            toast.error('Failed to update operating entity');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const deleteOperatingEntity = useCallback(async (id: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.deleteOperatingEntity(id);
            toast.success('Operating entity deleted successfully');
        } catch (error) {
            console.error('Error deleting operating entity:', error);
            toast.error('Failed to delete operating entity');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        operatingEntities,
        totalItems,
        totalPages,
        fetchOperatingEntities,
        createOperatingEntity,
        updateOperatingEntity,
        deleteOperatingEntity,
        isInitialized: !!api
    };
};