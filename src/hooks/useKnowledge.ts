// hooks/useKnowledge.ts
import { useState, useCallback, useMemo } from 'react';
import { createKnowledgeApi } from '@/app/api/external/omnigateway/knowledge';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useKnowledge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [queryResponses, setQueryResponses] = useState([]);
  const [unrecognizedQueries, setUnrecognizedQueries] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentQueryResponse, setCurrentQueryResponse] = useState(null);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createKnowledgeApi(apiKey) : null, [apiKey]);

  // Knowledge Documents
  const fetchDocuments = useCallback(async (params = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getDocuments(params);
      setDocuments(response.items || response);
      
      // Handle pagination metadata if available
      if (response) {
        setTotalItems(response.total || 0);
        setTotalPages(response.pages || 0);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch knowledge documents');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const getDocumentById = useCallback(async (id) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getDocumentById(id);
      setCurrentDocument(response);
      return response;
    } catch (error) {
      toast.error('Failed to fetch document details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const createDocument = useCallback(async (documentData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.createDocument(documentData);
      toast.success('Document created successfully');
      return response;
    } catch (error) {
      toast.error('Failed to create document');
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateDocument = useCallback(async (id, documentData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateDocument(id, documentData);
      toast.success('Document updated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to update document');
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const deleteDocument = useCallback(async (id) => {
    if (!api) return;
    try {
      setIsLoading(true);
      await api.deleteDocument(id);
      toast.success('Document deleted successfully');
      // Refresh documents after deletion
      await fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchDocuments]);

  // Document Search
  const searchDocuments = useCallback(async (params) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.searchDocuments(params);
      return response;
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Unrecognized Queries
  const fetchUnrecognizedQueries = useCallback(async (params = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getUnrecognizedQueries(params);
      setUnrecognizedQueries(response.queries || response);
      
      // Handle pagination metadata if available
      if (response.meta) {
        setTotalItems(response.meta.total || 0);
        setTotalPages(response.meta.pages || 0);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch unrecognized queries');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const respondToQuery = useCallback(async (id, responseData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.respondToQuery(id, responseData);
      toast.success('Response submitted successfully');
      return response;
    } catch (error) {
      toast.error('Failed to submit response');
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Query-Response Pairs
  const fetchQueryResponses = useCallback(async (params = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getQueryResponses(params);
      setQueryResponses(response.items || response);
      
      // Handle pagination metadata if available
      if (response.meta) {
        setTotalItems(response.meta.total || 0);
        setTotalPages(response.meta.pages || 0);
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to fetch query responses');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const getQueryResponseById = useCallback(async (id) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getQueryResponseById(id);
      setCurrentQueryResponse(response);
      return response;
    } catch (error) {
      toast.error('Failed to fetch query response details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const createQueryResponse = useCallback(async (queryResponseData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.createQueryResponse(queryResponseData);
      toast.success('Query response created successfully');
      return response;
    } catch (error) {
      toast.error('Failed to create query response');
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateQueryResponse = useCallback(async (id, queryResponseData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateQueryResponse(id, queryResponseData);
      toast.success('Query response updated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to update query response');
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const deleteQueryResponse = useCallback(async (id) => {
    if (!api) return;
    try {
      setIsLoading(true);
      await api.deleteQueryResponse(id);
      toast.success('Query response deleted successfully');
      // Refresh query responses after deletion
      await fetchQueryResponses();
    } catch (error) {
      toast.error('Failed to delete query response');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchQueryResponses]);

  // Feedback
  const submitFeedback = useCallback(async (id, feedbackData) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.submitFeedback(id, feedbackData);
      toast.success('Feedback submitted successfully');
      return response;
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Statistics
  const fetchStatistics = useCallback(async (params = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getQueryResponseStatistics(params);
      setStatistics(response);
      return response;
    } catch (error) {
      toast.error('Failed to fetch statistics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    isLoading,
    documents,
    queryResponses,
    unrecognizedQueries,
    statistics,
    totalItems,
    totalPages,
    currentDocument,
    currentQueryResponse,
    fetchDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    fetchUnrecognizedQueries,
    respondToQuery,
    fetchQueryResponses,
    getQueryResponseById,
    createQueryResponse,
    updateQueryResponse,
    deleteQueryResponse,
    submitFeedback,
    fetchStatistics,
    isInitialized: !!api
  };
};