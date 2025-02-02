// hooks/useMembers.ts
import { useState, useCallback, useMemo } from 'react';
import { createMembersApi } from '@/app/api/external/omnigateway/members';
import { Member, MemberMetrics, CreateMemberDto, UpdateMemberDto, MemberParams } from "@/app/api/external/omnigateway/types/members";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useMembers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState<MemberMetrics>({
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        rejectedMembers: 0,
        trends: {
            members: { value: 0, percentage: 0 },
            active: { value: 0, percentage: 0 },
            pending: { value: 0, percentage: 0 },
            rejected: { value: 0, percentage: 0 }
        }
    });

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createMembersApi(apiKey) : null, [apiKey]);

    const fetchMembers = useCallback(async (params: MemberParams = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getMembers(params);
            setMembers(response.items);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            setMetrics(response.metrics);
            return response;
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to fetch members');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createMember = useCallback(async (data: CreateMemberDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.createMember(data);
            toast.success('Member created successfully');
            return response;
        } catch (error) {
            console.error('Error creating member:', error);
            toast.error('Failed to create member');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateMember = useCallback(async (id: string, data: Partial<UpdateMemberDto>) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateMember(id, data);
            toast.success('Member updated successfully');
            return response;
        } catch (error) {
            console.error('Error updating member:', error);
            toast.error('Failed to update member');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const deleteMember = useCallback(async (id: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.deleteMember(id);
            toast.success('Member deleted successfully');
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Failed to delete member');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        members,
        totalItems,
        totalPages,
        metrics,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,
        isInitialized: !!api
    };
};