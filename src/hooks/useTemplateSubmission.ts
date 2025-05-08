import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getFormValidationRules, validateForm, getArticleValidationRules } from '@/utils/formValidation';

type SubmissionState = {
  isSubmitting: boolean;
  imageUrl: string | null;
  error: string | null;
};

type SubmissionResult = SubmissionState & {
  submitTemplate: (formData: FormData) => Promise<boolean>;
};

/**
 * Hook for handling template form submission with validation
 */
export function useTemplateSubmission(): SubmissionResult {
  const [state, setState] = useState<SubmissionState>({
    isSubmitting: false,
    imageUrl: null,
    error: null
  });

  const submitTemplate = async (formData: FormData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));
      
      // Get template type
      const templateType = formData.get('template_type') as string;
      if (!templateType) {
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
        setState(prev => ({ ...prev, isSubmitting: false, error: errorMessage }));
        return false;
      }

      // Submit the form
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok || result.status !== 1) {
        throw new Error(result.msg || 'Failed to generate image');
      }

      // On success
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        imageUrl: result.img || null 
      }));
      
      // Log success
      console.log('Success:', result);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Form submission error:', error);
      
      // Show error toast
      toast.error(errorMessage);
      
      // Update state
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  };

  return {
    ...state,
    submitTemplate
  };
}