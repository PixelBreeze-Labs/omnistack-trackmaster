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
  // ONLY ADDING THESE TWO NEW FIELDS
  isRetrying: boolean;
  retryCount: number;
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
    processingTime: null,
    // ONLY ADDING THESE TWO NEW FIELDS
    isRetrying: false,
    retryCount: 0
  });

  // ONLY ADDING THIS HELPER FUNCTION
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitTemplate = async (formData: FormData): Promise<boolean> => {
    const startTime = Date.now();
    
    try {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: true, 
        error: null, 
        imageUrl: null,
        processingTime: null,
        // ONLY ADDING THESE TWO RESETS
        isRetrying: false,
        retryCount: 0
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
        if (typeof value === 'object' && value !== null && typeof value.name === 'string') {
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

      // ONLY ADDING RETRY LOGIC HERE - YOUR ORIGINAL CODE STAYS THE SAME
      const MAX_RETRIES = 3;
      const RETRY_DELAYS = [2000, 4000, 6000]; // 2s, 4s, 6s
      let lastError = '';

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          // If this is a retry, show retry UI and wait
          if (attempt > 1) {
            setState(prev => ({ 
              ...prev, 
              isRetrying: true, 
              retryCount: attempt - 1 
            }));
            
            const delayTime = RETRY_DELAYS[attempt - 2] || 6000;
            await delay(delayTime);
            
            // Log retry as WARNING (not error)
            console.warn(`Retrying template submission (${attempt - 1}/${MAX_RETRIES - 1})...`);
          }

          // Submit the form (YOUR ORIGINAL CODE)
          const response = await fetch('/api/templates/generate', {
            method: 'POST',
            body: formData,
          });

          const result: TemplateResponse = await response.json();
          
          if (!response.ok || result.status !== 1) {
            lastError = result.msg || 'Failed to generate image';
            
            // Log as warning for retry attempts, error only for final failure
            console[attempt < MAX_RETRIES ? 'warn' : 'error'](
              `Template submission attempt ${attempt}/${MAX_RETRIES} failed:`, 
              lastError
            );

            // If this was the last attempt, break
            if (attempt === MAX_RETRIES) {
              break;
            }
            continue; // Try again
          }

          // SUCCESS - YOUR ORIGINAL CODE
          setState(prev => ({ 
            ...prev, 
            isSubmitting: false, 
            isRetrying: false,
            imageUrl: result.img || null,
            processingTime: result.processingTime || (Date.now() - startTime)
          }));
          
          return true;

        } catch (error) {
          lastError = error instanceof Error ? error.message : 'An error occurred';
          
          // Log as warning for retry attempts, error only for final failure
          console[attempt < MAX_RETRIES ? 'warn' : 'error'](
            `Template submission attempt ${attempt}/${MAX_RETRIES} failed:`, 
            lastError
          );

          // If this was the last attempt, break
          if (attempt === MAX_RETRIES) {
            break;
          }
        }
      }

      // ALL RETRIES FAILED - YOUR ORIGINAL ERROR HANDLING
      const errorMessage = lastError;
      console.error('Form submission failed after all retries:', errorMessage);
      
      // Show error toast
      toast.error(errorMessage);
      
      // Calculate time to failure
      const endTime = Date.now();
      const failureTime = endTime - startTime;
      
      // Update state with error but include processing time
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        isRetrying: false,
        error: errorMessage,
        processingTime: failureTime
      }));
      
      return false;

    } catch (error) {
      // YOUR ORIGINAL CATCH BLOCK - UNCHANGED
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
        isRetrying: false,
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