import { useState, useCallback, useMemo } from 'react';
import { createGeneratedImagesApi } from '@/app/api/external/omnigateway/generated-images';
import { 
  GeneratedImage,
  CreateGeneratedImageDto,
  GeneratedImageStats,
  ListGeneratedImagesParams,
  EntityType,
  LogEntry
} from '@/app/api/external/omnigateway/types/generatedImage';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { toast } from 'react-hot-toast';

export const useGeneratedImages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<GeneratedImageStats | null>(null);
  const [sessionLogs, setSessionLogs] = useState<LogEntry[]>([]);

  // Get API key from your authentication system
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createGeneratedImagesApi(apiKey) : null, [apiKey]);

  // Create a new generated image record
  const createGeneratedImage = useCallback(async (imageData: CreateGeneratedImageDto) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.createGeneratedImage(imageData);
      return response;
    } catch (error) {
      toast.error('Failed to create image record');
      // Log the error
      if (imageData.sessionId) {
        await api.logEvent({
          type: 'ERROR',
          message: 'Failed to create generated image record',
          details: error,
          sessionId: imageData.sessionId,
          actionType: 'CREATE_IMAGE_RECORD'
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Fetch generated images with optional filtering
  const fetchGeneratedImages = useCallback(async (params: ListGeneratedImagesParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getGeneratedImages(params);
      setImages(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      return response;
    } catch (error) {
      toast.error('Failed to fetch generated images');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single generated image by ID
  const getGeneratedImageById = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getGeneratedImageById(id);
      return response;
    } catch (error) {
      toast.error('Failed to fetch image details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Update the download time for an image
  const recordImageDownload = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.updateDownloadTime(id);
      toast.success('Image download recorded');
      return response;
    } catch (error) {
      toast.error('Failed to record image download');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Delete a generated image
  const deleteGeneratedImage = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.deleteGeneratedImage(id);
      toast.success('Image deleted successfully');
      return response;
    } catch (error) {
      toast.error('Failed to delete image');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get statistics about generated images
  const fetchImageStats = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getGeneratedImageStats();
      setStats(response);
      return response;
    } catch (error) {
      toast.error('Failed to fetch image statistics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Log an event related to image generation
  const logEvent = useCallback(async (logData: {
    type: 'ERROR' | 'SUCCESS' | 'INFO';
    message: string;
    details?: any;
    sessionId: string;
    imageId?: string;
    endpoint?: string;
    actionType?: string;
  }) => {
    if (!api) return;
    try {
      return await api.logEvent(logData);
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }, [api]);

  // Get logs for a specific session
  const getSessionLogs = useCallback(async (sessionId: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const logs = await api.getSessionLogs(sessionId);
      setSessionLogs(logs);
      return logs;
    } catch (error) {
      toast.error('Failed to fetch session logs');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Filter images by entity type
  const filterByEntity = useCallback((entity: EntityType, page: number = 1, limit: number = 20) => {
    return fetchGeneratedImages({ entity, page, limit });
  }, [fetchGeneratedImages]);

  // Filter images by template type
  const filterByTemplateType = useCallback((templateType: string, page: number = 1, limit: number = 20) => {
    return fetchGeneratedImages({ templateType, page, limit });
  }, [fetchGeneratedImages]);

  return {
    isLoading,
    images,
    totalItems,
    totalPages,
    currentPage,
    stats,
    sessionLogs,
    createGeneratedImage,
    fetchGeneratedImages,
    getGeneratedImageById,
    recordImageDownload,
    deleteGeneratedImage,
    fetchImageStats,
    logEvent,
    getSessionLogs,
    filterByEntity,
    filterByTemplateType,
    isInitialized: !!api
  };
};