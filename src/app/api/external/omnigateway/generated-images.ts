

import { createOmniGateway } from './index';
import { 
  GeneratedImage, 
  CreateGeneratedImageDto,
  GeneratedImagesResponse,
  GeneratedImageStats,
  ListGeneratedImagesParams
} from './types/generatedImage';

// Create axios instance with base configuration
export const createGeneratedImagesApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

  return {
    // Create a new generated image record
    createGeneratedImage: async (imageData: CreateGeneratedImageDto): Promise<GeneratedImage> => {
      const { data } = await api.post('/generated-images', imageData);
      return data;
    },

    // Get all generated images with filtering and pagination
    getGeneratedImages: async (params: ListGeneratedImagesParams = {}): Promise<GeneratedImagesResponse> => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.entity) queryParams.append('entity', params.entity);
      if (params.templateType) queryParams.append('templateType', params.templateType);
      
      const queryString = queryParams.toString();
      const endpoint = `/generated-images${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },

    // Get a single generated image by ID
    getGeneratedImageById: async (id: string): Promise<GeneratedImage> => {
      const { data } = await api.get(`/generated-images/${id}`);
      return data;
    },

    // Update the download time for an image
    updateDownloadTime: async (id: string): Promise<GeneratedImage> => {
      const { data } = await api.put(`/generated-images/${id}/download`);
      return data;
    },

    // Delete a generated image
    deleteGeneratedImage: async (id: string): Promise<{ message: string }> => {
      const { data } = await api.delete(`/generated-images/${id}`);
      return data;
    },

    // Get statistics about generated images
    getGeneratedImageStats: async (): Promise<GeneratedImageStats> => {
      const { data } = await api.get('/generated-images/stats');
      return data;
    },

    // Log an event related to image generation
    logEvent: async (logData: {
      type: 'ERROR' | 'SUCCESS' | 'INFO';
      message: string;
      details?: any;
      sessionId: string;
      imageId?: string;
      endpoint?: string;
      actionType?: string;
    }): Promise<any> => {
      const { data } = await api.post('/logs', logData);
      return data;
    },

    // Get logs for a specific session
    getSessionLogs: async (sessionId: string): Promise<any> => {
      const { data } = await api.get(`/logs/session/${sessionId}`);
      return data;
    }
  };
};
