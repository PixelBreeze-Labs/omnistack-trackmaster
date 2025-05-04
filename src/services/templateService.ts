// src/services/templateService.ts
import axios from 'axios';

export interface GenerateImageParams {
  template_type: string;
  title?: string;
  category?: string;
  article_url?: string;
  image?: File;
}

export interface GenerateImageResponse {
  status: number;
  msg: string;
  img?: string;
  details?: string;
}

/**
 * Service for interacting with the template API
 */
export class TemplateService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = '/api/templates';
  }
  
  /**
   * Generate an image based on a template and provided parameters
   */
  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Add required parameters
      formData.append('template_type', params.template_type);
      
      // Add optional parameters if provided
      if (params.title) {
        formData.append('title', params.title);
      }
      
      if (params.category) {
        formData.append('category', params.category);
      }
      
      if (params.article_url) {
        formData.append('artical_url', params.article_url);
      }
      
      if (params.image) {
        formData.append('image', params.image);
      }
      
      // Make API request
      const response = await axios.post<GenerateImageResponse>(
        `${this.apiUrl}/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Return error response from API
        return error.response.data as GenerateImageResponse;
      }
      
      // Return generic error
      return {
        status: 0,
        msg: 'Failed to generate image. Please try again later.',
      };
    }
  }
  
  /**
   * Get available templates
   */
  async getTemplates() {
    try {
      const response = await axios.get(`${this.apiUrl}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  }
  
  /**
   * Get a template by ID
   */
  async getTemplateById(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch template with ID ${id}:`, error);
      return null;
    }
  }
}

// Create and export singleton instance
export const templateService = new TemplateService();

export default templateService;