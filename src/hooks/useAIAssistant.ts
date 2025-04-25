// hooks/useAIAssistant.ts
import { useState, useCallback, useMemo } from 'react';
import { createAIAssistantApi } from '@/app/api/external/omnigateway/ai-assistant';
import { 
    AIQueryContext, 
    AIQueryResponse,
    AssistantType
} from '@/app/api/external/omnigateway/types/ai-assistant';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useAIAssistant = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<AIQueryResponse | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [currentType, setCurrentType] = useState<AssistantType>(AssistantType.ADMIN);
    
    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createAIAssistantApi(apiKey) : null, [apiKey]);

    const askAssistant = useCallback(async (query: string, context?: Partial<AIQueryContext>) => {
        if (!api) {
            toast.error('API connection not available');
            return null;
        }
        
        try {
            setIsLoading(true);
            
            // Prepare full context with default values
            const fullContext: AIQueryContext = {
                assistantType: context?.assistantType || currentType,
                startDate: context?.startDate,
                endDate: context?.endDate,
                customerId: context?.customerId,
                productId: context?.productId,
                categoryId: context?.categoryId,
                searchTerm: context?.searchTerm
            };
            
            // Update the current type based on the query context
            if (context?.assistantType) {
                setCurrentType(context.assistantType);
            }
            
            const result = await api.askAssistant(query, fullContext);
            setResponse(result);
            
            // Update suggestions if they're provided
            if (result.suggestions && result.suggestions.length > 0) {
                setSuggestions(result.suggestions);
            }
            
            return result;
        } catch (error) {
            console.error('Error querying AI assistant:', error);
            toast.error('Failed to get AI response');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [api, currentType]);

    const getSuggestions = useCallback(async (type: AssistantType) => {
        if (!api) {
            toast.error('API connection not available');
            return [];
        }
        
        try {
            setIsLoading(true);
            const result = await api.getSuggestions(type);
            setSuggestions(result);
            return result;
        } catch (error) {
            console.error('Error getting suggestions:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const getInsights = useCallback(async (type: AssistantType, params?: { startDate?: string, endDate?: string }) => {
        if (!api) {
            toast.error('API connection not available');
            return null;
        }
        
        try {
            setIsLoading(true);
            const result = await api.getInsights(type, params || {});
            setResponse(result);
            if (result.suggestions) {
                setSuggestions(result.suggestions);
            }
            return result;
        } catch (error) {
            console.error('Error getting insights:', error);
            toast.error('Failed to get insights');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const getDashboard = useCallback(async () => {
        if (!api) {
            toast.error('API connection not available');
            return null;
        }
        
        try {
            setIsLoading(true);
            const result = await api.getDashboard();
            setResponse(result);
            if (result.suggestions) {
                setSuggestions(result.suggestions);
            }
            return result;
        } catch (error) {
            console.error('Error getting dashboard:', error);
            toast.error('Failed to get dashboard data');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createDiscountSuggestion = useCallback(async (params: { percentage?: number, target?: string }) => {
        if (!api) {
            toast.error('API connection not available');
            return null;
        }
        
        try {
            setIsLoading(true);
            const result = await api.createDiscountSuggestion(params);
            setResponse(result);
            return result;
        } catch (error) {
            console.error('Error creating discount suggestion:', error);
            toast.error('Failed to create discount suggestion');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const setAssistantType = useCallback((type: AssistantType) => {
        setCurrentType(type);
        // Fetch new suggestions when type changes
        if (api) {
            getSuggestions(type).catch(console.error);
        }
    }, [api, getSuggestions]);

    return {
        isLoading,
        response,
        suggestions,
        currentType,
        askAssistant,
        getSuggestions,
        getInsights,
        getDashboard,
        createDiscountSuggestion,
        setAssistantType,
        isInitialized: !!api
    };
};