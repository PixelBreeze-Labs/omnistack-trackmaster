// hooks/useFamilyAccounts.ts
import { useState, useCallback, useMemo } from 'react';
import { createFamilyAccountsApi } from '../app/api/external/omnigateway/family-accounts';
import { FamilyAccount, FamilyMetrics, LinkFamilyPayload, UpdateFamilyPayload } from "@/app/api/external/omnigateway/types/family-account";
import { useGatewayClientApiKey } from '../hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';


export const useFamilyAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [familyAccounts, setFamilyAccounts] = useState<FamilyAccount[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState<FamilyMetrics>({
        totalFamilies: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        linkedMembers: 0,
        averageSize: 0,
        familySpendingMultiplier: 0
    });

    const [searchResults, setSearchResults] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [familyStats, setFamilyStats] = useState(null);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createFamilyAccountsApi(apiKey) : null, [apiKey]);

    const fetchFamilyAccounts = useCallback(async (params = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getFamilyAccounts(params);
            setFamilyAccounts(response.items);
            setTotalItems(response.total);
            setTotalPages(response.pages);
            setMetrics(response.metrics);
            return response;
        } catch (error) {
            console.error('Error fetching family accounts:', error);
            toast.error('Failed to fetch family accounts');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const handleSearch = useCallback(async (query: string) => {
        if (!api || query.length < 2) return;
        setIsSearching(true);
        try {
            const results = await api.searchCustomers(query);
            setSearchResults(results.items);
            return results;
        } catch (error) {
            toast.error('Failed to search customers');
            throw error;
        } finally {
            setIsSearching(false);
        }
    }, [api]);

    const linkFamily = useCallback(async (payload: LinkFamilyPayload) => {
        if (!api) return;
        try {
            const result = await api.linkFamily(payload);
            await fetchFamilyAccounts();
            toast.success('Family account linked successfully');
            return result;
        } catch (error) {
            toast.error('Failed to link family account');
            throw error;
        }
    }, [api, fetchFamilyAccounts]);

    const unlinkMember = useCallback(async (familyId: string, memberId: string) => {
        if (!api) return;
        try {
            await api.unlinkMember(familyId, memberId);
            await fetchFamilyAccounts();
            if (selectedFamily?.id === familyId) {
                await getFamilyDetails(familyId);
            }
        } catch (error) {
            
            throw error;
        }
    }, [api, fetchFamilyAccounts, selectedFamily]);

    const updateFamily = useCallback(async (id: string, payload: UpdateFamilyPayload) => {
        if (!api) return;
        try {
            const response = await api.updateFamily(id, payload);
            await fetchFamilyAccounts();
            if (selectedFamily?.id === id) {
                await getFamilyDetails(id);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }, [api, fetchFamilyAccounts, selectedFamily]);

    const getFamilyDetails = useCallback(async (id: string) => {
        if (!api) return;
        try {
            const family = await api.getFamilyDetails(id);
            setSelectedFamily(family);
            return family;
        } catch (error) {
            toast.error('Failed to fetch family details');
            throw error;
        }
    }, [api]);

    const getFamilyStats = useCallback(async (id: string) => {
        if (!api) return;
        try {
            const stats = await api.getFamilyStats(id);
            setFamilyStats(stats);
            return stats;
        } catch (error) {
            toast.error('Failed to fetch family stats');
            throw error;
        }
    }, [api]);

    return {
        isLoading,
        isSearching,
        familyAccounts,
        totalItems,
        totalPages,
        metrics,
        searchResults,
        selectedFamily,
        familyStats,
        fetchFamilyAccounts,
        handleSearch,
        linkFamily,
        unlinkMember,
        updateFamily,
        getFamilyDetails,
        getFamilyStats,
        isInitialized: !!api
    };
};