import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getFormValidationRules, validateForm, getArticleValidationRules } from '@/utils/formValidation';

interface TemplateResponse {
  status: number;
  msg?: string;
  img?: string;
  processingTime?: number;
  processingTimeFormatted?: string;
}

type SubmissionState = {
  isSubmitting: boolean;
  imageUrl: string | null;
  error: string | null;
  processingTime: number | null;
};

type SubmissionResult = SubmissionState & {
  submitTemplate: (formData: FormData) => Promise<boolean>;
};

/**
 * Hook for handling template form submission with validation and timing
 */
export function useTemplateSubmission(): SubmissionResult {
  const [state, setState] = useState<SubmissionState>({
    isSubmitting: false,
    imageUrl: null,
    error: null,
    processingTime: null
  });

  const submitTemplate = async (formData: FormData): Promise<boolean> => {
    const startTime = Date.now();
    
    try {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: true, 
        error: null, 
        imageUrl: null,
        processingTime: null 
      }));
      
      // Get template type
      const templateType = formData.get('template_type') as string;
      if (!templateType) {
        // Set submitting to false immediately on validation errors
        setState(prev => ({ ...prev, isSubmitting: false }));
        throw new Error('Template type is required');
      }

      // Determine if this is an article-based template
      const isArticle = (
        (templateType === 'web_news_story' || 
         templateType === 'web_news_story_2' || 
         templateType === 'web_news') && 
        formData.get('artical_url')
      );

      // Get appropriate validation rules
      const validationRules = isArticle 
        ? getArticleValidationRules() 
        : getFormValidationRules(templateType);

      // Create validation data object from form data
      const validationData: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        // Handle File entries differently
        if (value instanceof File) {
          validationData[key] = value;
        } else {
          validationData[key] = value;
        }
      }

      // Client-side validation
      const { isValid, errors } = validateForm(validationData, validationRules);
      
      if (!isValid) {
        const errorMessage = errors.join('<br />');
        toast.error(errorMessage.replace(/<br \/>/g, ' '));
        
        // Set submitting to false immediately on validation errors
        setState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          error: errorMessage,
          processingTime: Date.now() - startTime // Record time even for errors
        }));
        
        return false;
      }

      // Submit the form
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        body: formData,
      });

      const result: TemplateResponse = await response.json();
      
      if (!response.ok || result.status !== 1) {
        // Calculate time to failure
        const endTime = Date.now();
        const failureTime = endTime - startTime;
        
        // Update state with error but include processing time
        setState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          error: result.msg || 'Failed to generate image',
          processingTime: failureTime
        }));
        
        // Show error toast
        toast.error(result.msg || 'Failed to generate image');
        
        return false;
      }

      // On success
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        imageUrl: result.img || null,
        processingTime: result.processingTime || (Date.now() - startTime)
      }));
      
      // Log success
      console.log('Success:', result);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Form submission error:', error);
      
      // Show error toast
      toast.error(errorMessage);
      
      // Calculate time to failure
      const endTime = Date.now();
      const failureTime = endTime - startTime;
      
      // Update state with error but include processing time
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: errorMessage,
        processingTime: failureTime
      }));
      
      return false;
    }
  };

  return {
    ...state,
    submitTemplate
  };
}