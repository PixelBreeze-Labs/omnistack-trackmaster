// app/api/external/omnigateway/knowledge.ts
import { createOmniGateway } from './index';

export const createKnowledgeApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Knowledge Documents
    getDocuments: async (params?: {
      limit?: number;
      page?: number;
      search?: string;
      categories?: string[];
      type?: string;
    }) => {
      const { data } = await api.get('/knowledge-base/documents', { params });
      return data;
    },

    getDocumentById: async (id: string) => {
      const { data } = await api.get(`/knowledge-base/documents/${id}`);
      return data;
    },

    createDocument: async (documentData: any) => {
      const { data } = await api.post('/knowledge-base/documents', documentData);
      return data;
    },

    updateDocument: async (id: string, documentData: any) => {
      const { data } = await api.put(`/knowledge-base/documents/${id}`, documentData);
      return data;
    },

    deleteDocument: async (id: string) => {
      const { data } = await api.delete(`/knowledge-base/documents/${id}`);
      return data;
    },

    // Document Search
    searchDocuments: async (params: {
      query: string;
      businessType?: string;
      features?: string[];
      categories?: string[];
      limit?: number;
    }) => {
      const { data } = await api.get('/knowledge-base/search', { params });
      return data;
    },

    // Unrecognized Queries
    getUnrecognizedQueries: async (params?: {
      limit?: number;
      page?: number;
      businessType?: string;
    }) => {
      const { data } = await api.get('/knowledge-base/unrecognized-queries', { params });
      return data;
    },

    respondToQuery: async (
      id: string,
      responseData: {
        response: string;
        createKnowledgeDoc?: boolean;
        knowledgeDocData?: any;
      }
    ) => {
      const { data } = await api.post(`/knowledge-base/unrecognized-queries/${id}/respond`, responseData);
      return data;
    },

    // Query-Response Pairs
    getQueryResponses: async (params?: {
      limit?: number;
      page?: number;
      category?: string;
      search?: string;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    }) => {
      const { data } = await api.get('/knowledge-base/query-responses', { params });
      return data;
    },

    getQueryResponseById: async (id: string) => {
      const { data } = await api.get(`/knowledge-base/query-responses/${id}`);
      return data;
    },

    createQueryResponse: async (queryResponseData: any) => {
      const { data } = await api.post('/knowledge-base/query-responses', queryResponseData);
      return data;
    },

    updateQueryResponse: async (id: string, queryResponseData: any) => {
      const { data } = await api.put(`/knowledge-base/query-responses/${id}`, queryResponseData);
      return data;
    },

    deleteQueryResponse: async (id: string) => {
      const { data } = await api.delete(`/knowledge-base/query-responses/${id}`);
      return data;
    },

    // Feedback
    submitFeedback: async (id: string, feedbackData: { helpful: boolean; comment?: string }) => {
      const { data } = await api.post(`/knowledge-base/feedback/${id}`, feedbackData);
      return data;
    },

    // Statistics
    getQueryResponseStatistics: async (params?: {
      timeframe?: 'day' | 'week' | 'month' | 'year';
    }) => {
      const { data } = await api.get('/knowledge-base/query-responses/statistics', { params });
      return data;
    }
  };
};