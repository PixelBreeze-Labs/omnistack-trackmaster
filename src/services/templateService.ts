// src/services/templateService.ts
import axios from 'axios';

interface TemplateServiceOptions {
  apiUrl?: string;
}

export class TemplateService {
  private apiUrl: string;

  constructor(options: TemplateServiceOptions = {}) {
    this.apiUrl = options.apiUrl || process.env.NEXT_PYTHON_API_URL || 'http://localhost:5000';
  }

  /**
   * Process a template and generate an image
   * @param formData Data for template processing
   * @returns Object containing status, message, and image URL
   */
  async processTemplate(formData: FormData): Promise<{ status: number; msg?: string; img?: string }> {
    try {
      // Call the Python API to generate the image
      const response = await axios.post(`${this.apiUrl}/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('Response from Python API:', response.data);


      // Return the API response
      return response.data;
    } catch (error) {
      console.error('Template processing error:', error);
      
      // If it's an axios error with a response
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 0,
          msg: error.response.data?.msg || "Failed to process template",
        };
      }
      
      // Generic error
      return {
        status: 0,
        msg: "Failed to connect to image generation service",
      };
    }
  }

  /**
   * Get all available templates
   * @returns Array of template objects
   */
  async getTemplates() {
    try {
      const response = await axios.get(`${this.apiUrl}/templates`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  }

  /**
   * Get a specific template by ID
   * @param id Template ID
   * @returns Template object
   */
  async getTemplateById(id: string | number) {
    try {
      const response = await axios.get(`${this.apiUrl}/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch template with ID ${id}:`, error);
      return null;
    }
  }
}

// Export a singleton instance
export const templateService = new TemplateService();

// Export the class for testing or custom instantiation
export default TemplateService;