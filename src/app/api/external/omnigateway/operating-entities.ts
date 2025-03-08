// app/api/external/omnigateway/operating-entities.ts
import { createOmniGateway } from './index';
import { CreateOperatingEntityDto, UpdateOperatingEntityDto, OperatingEntityParams, OperatingEntityResponse, OperatingEntity } from './types/operating-entities';

export const createOperatingEntitiesApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getOperatingEntities: async (params: OperatingEntityParams = {}): Promise<OperatingEntityResponse> => {
            const { data } = await api.get('/operating-entities', { params });
            return data;
        },
        
        createOperatingEntity: async (entityData: CreateOperatingEntityDto): Promise<OperatingEntity> => {
            const { data } = await api.post('/operating-entities', entityData);
            return data;
        },
        
        updateOperatingEntity: async (id: string, entityData: UpdateOperatingEntityDto): Promise<OperatingEntity> => {
            const { data } = await api.put(`/operating-entities/${id}`, entityData);
            return data;
        },
        
        getOperatingEntity: async (id: string): Promise<OperatingEntity> => {
            const { data } = await api.get(`/operating-entities/${id}`);
            return data;
        },
        
        deleteOperatingEntity: async (id: string): Promise<void> => {
            await api.delete(`/operating-entities/${id}`);
        }
    };
};