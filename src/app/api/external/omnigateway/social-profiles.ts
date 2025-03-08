// app/api/external/omnigateway/social-profiles.ts
import { createOmniGateway } from './index';
import { CreateSocialProfileDto, UpdateSocialProfileDto, SocialProfileParams, SocialProfileResponse, SocialProfile } from './types/social-profiles';

export const createSocialProfilesApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getSocialProfiles: async (params: SocialProfileParams = {}): Promise<SocialProfileResponse> => {
            const { data } = await api.get('/social-profiles', { params });
            return data;
        },
        
        createSocialProfile: async (profileData: CreateSocialProfileDto): Promise<SocialProfile> => {
            const { data } = await api.post('/social-profiles', profileData);
            return data;
        },
        
        updateSocialProfile: async (id: string, profileData: UpdateSocialProfileDto): Promise<SocialProfile> => {
            const { data } = await api.put(`/social-profiles/${id}`, profileData);
            return data;
        },
        
        getSocialProfile: async (id: string): Promise<SocialProfile> => {
            const { data } = await api.get(`/social-profiles/${id}`);
            return data;
        },
        
        deleteSocialProfile: async (id: string): Promise<void> => {
            await api.delete(`/social-profiles/${id}`);
        }
    };
};