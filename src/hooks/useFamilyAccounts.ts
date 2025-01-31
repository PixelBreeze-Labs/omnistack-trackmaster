// hooks/useFamilyAccounts.ts
export const useFamilyAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [familyAccounts, setFamilyAccounts] = useState<FamilyAccount[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState({
        totalFamilies: 0,
        linkedMembers: 0,
        averageSize: 0,
        familySpendingMultiplier: 0
    });

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

    return {
        isLoading,
        familyAccounts,
        totalItems,
        totalPages,
        metrics,
        fetchFamilyAccounts,
        isInitialized: !!api
    };
};