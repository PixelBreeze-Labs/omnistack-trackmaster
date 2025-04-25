// app/api/external/omnigateway/ai-assistant.ts
import { createOmniGateway } from './index';
import { 
    AIQueryContext, 
    AIQueryResponse,
    AssistantType
} from './types/ai-assistant';

export const createAIAssistantApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        askAssistant: async (query: string, context: AIQueryContext): Promise<AIQueryResponse> => {
            const { data } = await api.post('/trackmaster/ai/ask', { query, context });
            return data;
        },
        
        getSuggestions: async (type: AssistantType): Promise<string[]> => {
            const { data } = await api.get(`/trackmaster/ai/suggestions?type=${type}`);
            return data;
        },
        
        getInsights: async (type: AssistantType, params: { 
            startDate?: string, 
            endDate?: string 
        }): Promise<AIQueryResponse> => {
            const { data } = await api.get(`/trackmaster/ai/insights/${type}`, { params });
            return data;
        },
        
        getDashboard: async (): Promise<AIQueryResponse> => {
            const { data } = await api.get('/trackmaster/ai/dashboard');
            return data;
        },
        
        createDiscountSuggestion: async (params: {
            percentage?: number,
            target?: string
        }): Promise<AIQueryResponse> => {
            const { data } = await api.get('/trackmaster/ai/create-discount', { params });
            return data;
        }
    };
};