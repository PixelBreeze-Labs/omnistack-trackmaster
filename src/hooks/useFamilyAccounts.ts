// hooks/useFamilyAccounts.ts
import { useState, useCallback, useMemo } from 'react';
import { createFamilyAccountsApi } from '@/app/api/external/omnigateway/family-accounts';
import { 
    FamilyAccount, 
    FamilyMetrics, 
    LinkFamilyPayload, 
    UpdateFamilyPayload 
} from "@/app/api/external/omnigateway/types/family-account";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from "sonner";

export const useFamilyAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [familyAccounts, setFamilyAccounts] = useState<FamilyAccount[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [metrics, setMetrics] = useState<FamilyMetrics>({
        totalFamilies: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        linkedMembers: 0,
        averageSize: 0,
        familySpendingMultiplier: 0
    });

    // Get API key from context
    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createFamilyAccountsApi(apiKey) : null, [apiKey]);

    // Fetch all family accounts with pagination and filters
    const fetchFamilyAccounts = useCallback(async (params = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getFamilyAccounts(params);
            setFamilyAccounts(response.items || []);
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

    // Search customers for linking
    const handleSearch = useCallback(async (query: string) => {
        if (!api || query.length < 2) return;
        setIsSearching(true);
        try {
            const results = await api.searchCustomers(query);
            setSearchResults(results.items);
            return results;
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search customers');
            throw error;
        } finally {
            setIsSearching(false);
        }
    }, [api]);

    // Create new family link
    const linkFamily = useCallback(async (payload: LinkFamilyPayload) => {
        if (!api) return;
        try {
            const result = await api.linkFamily(payload);
            await fetchFamilyAccounts(); // Refresh the list after linking
            return result;
        } catch (error) {
            console.error('Link family error:', error);
            toast.error('Failed to link family account');
            throw error;
        }
    }, [api, fetchFamilyAccounts]);

    // Unlink a member from a family
    const unlinkMember = useCallback(async (familyId: string, memberId: string) => {
        if (!api) return;
        try {
            const result = await api.unlinkMember(familyId, memberId);
            // Don't await the fetch - let the UI handle refresh timing
            fetchFamilyAccounts();
            return result;
        } catch (error) {
            console.error('Unlink member error:', error);
            throw error;
        }
    }, [api, fetchFamilyAccounts]);

    // Update family account
    const updateFamily = useCallback(async (id: string, payload: UpdateFamilyPayload) => {
        if (!api) return;
        try {
            const result = await api.updateFamily(id, payload);
            // Don't await the fetch - let the UI handle refresh timing
            fetchFamilyAccounts();
            return result;
        } catch (error) {
            console.error('Update family error:', error);
            toast.error('Failed to update family');
            throw error;
        }
    }, [api, fetchFamilyAccounts]);

    // Get family details
    const getFamilyDetails = useCallback(async (id: string) => {
        if (!api) return;
        try {
            const result = await api.getFamilyDetails(id);
            return result;
        } catch (error) {
            console.error('Get family details error:', error);
            toast.error('Failed to fetch family details');
            throw error;
        }
    }, [api]);

    // Get family statistics
    const getFamilyStats = useCallback(async (id: string) => {
        if (!api) return;
        try {
            const result = await api.getFamilyStats(id);
            return result;
        } catch (error) {
            console.error('Get family stats error:', error);
            toast.error('Failed to fetch family statistics');
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