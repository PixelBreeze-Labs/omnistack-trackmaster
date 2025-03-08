// hooks/useSocialProfiles.ts
import { useState, useCallback, useMemo } from 'react';
import { createSocialProfilesApi } from '@/app/api/external/omnigateway/social-profiles';
import { SocialProfile, CreateSocialProfileDto, UpdateSocialProfileDto, SocialProfileParams } from "@/app/api/external/omnigateway/types/social-profiles";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useSocialProfiles = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createSocialProfilesApi(apiKey) : null, [apiKey]);

    const fetchSocialProfiles = useCallback(async (params: SocialProfileParams = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getSocialProfiles(params);
            setSocialProfiles(response.items);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            console.error('Error fetching social profiles:', error);
            toast.error('Failed to fetch social profiles');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createSocialProfile = useCallback(async (data: CreateSocialProfileDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.createSocialProfile(data);
            toast.success('Social profile created successfully');
            return response;
        } catch (error) {
            console.error('Error creating social profile:', error);
            toast.error('Failed to create social profile');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateSocialProfile = useCallback(async (id: string, data: UpdateSocialProfileDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateSocialProfile(id, data);
            toast.success('Social profile updated successfully');
            return response;
        } catch (error) {
            console.error('Error updating social profile:', error);
            toast.error('Failed to update social profile');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const deleteSocialProfile = useCallback(async (id: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.deleteSocialProfile(id);
            toast.success('Social profile deleted successfully');
        } catch (error) {
            console.error('Error deleting social profile:', error);
            toast.error('Failed to delete social profile');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        socialProfiles,
        totalItems,
        totalPages,
        fetchSocialProfiles,
        createSocialProfile,
        updateSocialProfile,
        deleteSocialProfile,
        isInitialized: !!api
    };
};