"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import FormFactory from "@/components/crm/templates/forms/FormFactory";
import GenerationProgressTimer from "./GenerationProgressTimer";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";
import { useTemplateSubmission } from "@/hooks/useTemplateSubmission";

// Define template data type
type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  description?: string;
  entity: string;
};

// Use a complete lookup table for template data extracted from TemplateGrid
const TEMPLATE_DATA: Record<number, TemplateData> = {
  // IconStyle Templates
  1: {
    id: 1,
    name: "Feed Basic",
    image: "/images/templates/feed_basic.png",
    template_type: "feed_basic",
    description: "Template for basic social media feeds",
    entity: "iconstyle"
  },
  2: {
    id: 2,
    name: "Feed Swipe",
    image: "/images/templates/feed_swipe.png",
    template_type: "feed_swipe",
    description: "Template for swipeable social media content",
    entity: "iconstyle"
  },
  3: {
    id: 3,
    name: "Iconic Location",
    image: "/images/templates/iconic_location.png",
    template_type: "iconic_location",
    description: "Template highlighting locations with iconic design",
    entity: "iconstyle"
  },
  4: {
    id: 4,
    name: "Citim",
    image: "/images/templates/citim.png",
    template_type: "citim",
    description: "Template for article quotes and citations",
    entity: "iconstyle"
  },
  5: {
    id: 5,
    name: "Web News Story",
    image: "/images/templates/web_news_story.png",
    template_type: "web_news_story",
    description: "Template for news articles with headline and category",
    entity: "iconstyle"
  },
  6: {
    id: 6,
    name: "Feed Headline",
    image: "/images/templates/feed_headline.png",
    template_type: "feed_headline",
    description: "Template for headlines in social feeds",
    entity: "iconstyle"
  },
  7: {
    id: 7,
    name: "Logo Only",
    image: "/images/templates/logo_only_image.jpg",
    template_type: "logo_only",
    description: "Simple template featuring just the logo",
    entity: "iconstyle"
  },
  8: {
    id: 8,
    name: "Web News",
    image: "/images/templates/web_news.png",
    template_type: "web_news",
    description: "General template for web news content",
    entity: "iconstyle"
  },
  9: {
    id: 9,
    name: "Feed Location",
    image: "/images/templates/feed_location.png",
    template_type: "feed_location",
    description: "Template for location-based social media content",
    entity: "iconstyle"
  },
  10: {
    id: 10,
    name: "Quotes & Writings",
    image: "/images/templates/quotes_writings_art.png",
    template_type: "quotes_writings_art",
    description: "Artistic template for quotes and writings",
    entity: "iconstyle"
  },
  11: {
    id: 11,
    name: "Morning Quote",
    image: "/images/templates/quotes_writings_morning.png",
    template_type: "quotes_writings_morning",
    description: "Template for morning motivational quotes",
    entity: "iconstyle"
  },
  12: {
    id: 12,
    name: "Pa Thonjëza",
    image: "/images/templates/quotes_writings_thonjeza.png",
    template_type: "quotes_writings_thonjeza",
    description: "Template for quotes without quotation marks",
    entity: "iconstyle"
  },
  13: {
    id: 13,
    name: "Citim Blank",
    image: "/images/templates/quotes_writings_citim.png",
    template_type: "quotes_writings_citim",
    description: "Clean template for citations and quotes",
    entity: "iconstyle"
  },
  14: {
    id: 14,
    name: "Web News Story 2",
    image: "/images/templates/web_news_story_2.png",
    template_type: "web_news_story_2",
    description: "Alternative layout for news articles",
    entity: "iconstyle"
  },
  15: {
    id: 15,
    name: "Highlight",
    image: "/images/templates/highlight.png",
    template_type: "highlight",
    description: "Template for highlighting important content",
    entity: "iconstyle"
  },
  
  // Reforma Templates
  16: {
    id: 16,
    name: "Reforma Quotes Writing",
    image: "/images/templates/reforma_quotes_writings.jpeg",
    template_type: "reforma_quotes_writings",
    description: "Elegant template for quotes in Reforma style",
    entity: "reforma"
  },
  17: {
    id: 17,
    name: "Reforma New Quote",
    image: "/images/templates/reforma_new_quote.jpeg",
    template_type: "reforma_new_quote",
    description: "Fresh design for quotes in Reforma style",
    entity: "reforma"
  },
  18: {
    id: 18,
    name: "Reforma Feed Swipe",
    image: "/images/templates/reforma_feed_swipe.jpeg",
    template_type: "reforma_feed_swipe",
    description: "Swipeable feed content in Reforma style",
    entity: "reforma"
  },
  19: {
    id: 19,
    name: "Citim 2",
    image: "/images/templates/citim_version_2.jpeg",
    template_type: "citim_version_2",
    description: "Updated citation template for Reforma",
    entity: "reforma"
  },
  20: {
    id: 20,
    name: "Reforma News Feed",
    image: "/images/templates/reforma_news_feed.jpeg",
    template_type: "reforma_news_feed",
    description: "News feed template in Reforma style",
    entity: "reforma"
  },
  21: {
    id: 21,
    name: "Reforma Web News Story",
    image: "/images/templates/reforma_web_news_story1.jpeg",
    template_type: "reforma_web_news_story1",
    description: "News article template for Reforma",
    entity: "reforma"
  },
  22: {
    id: 22,
    name: "Reforma Web News Story (Caption)",
    image: "/images/templates/reforma_web_news_story_2.jpeg",
    template_type: "reforma_web_news_story_2",
    description: "News article with caption in Reforma style with caption",
    entity: "reforma"
  },
  23: {
    id: 23,
    name: "Reforma Web News Story 2",
    image: "/images/templates/reforma_web_news_story2.jpeg",
    template_type: "reforma_web_news_story2",
    description: "News article with caption in Reforma style without caption",
    entity: "reforma"
  },
  24: {
    id: 24,
    name: "Reforma Logo Only",
    image: "/images/templates/reforma_logo_only.jpg",
    template_type: "reforma_logo_only",
    description: "Simple logo template for Reforma",
    entity: "reforma"
  }
};

export default function TemplateForm({ templateId }: { templateId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  // New state for timing information
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [templateHistory, setTemplateHistory] = useState<Record<string, number>>({});
  
  const router = useRouter();
  
  // Initialize the hooks
  const { 
    logEvent, 
    createGeneratedImage, 
    recordImageDownload,
    isInitialized 
  } = useGeneratedImages();
  
  // Use the template submission hook
  const { 
    isSubmitting, 
    imageUrl, 
    error,
    processingTime,
    submitTemplate 
  } = useTemplateSubmission();

  // Update estimated generation time based on template history
  const getEstimatedTime = useCallback((templateType: string): number => {
    // If we have a history for this template type, use it
    if (templateHistory[templateType]) {
      return templateHistory[templateType];
    }
    
    // Default values based on template types
    if (templateType.includes('web_news_story')) {
      return 8000; // News stories take longer (8 seconds)
    }
    
    // Default estimate
    return 5000; // 5 seconds
  }, [templateHistory]);

  // Fetch template data
  const fetchTemplateData = useCallback(async () => {
    try {
      // Get template data from our predefined object for faster access
      const template = TEMPLATE_DATA[templateId];
      
      // Check if template exists
      if (!template) {
        toast.error("Template not found");
        router.push("/crm/platform/templates");
        return;
      }
      
      setTemplateData(template);
    } catch (error) {
      toast.error("Failed to load template");
    } finally {
      setIsLoading(false);
    }
  }, [templateId, router]);

  // Use an effect with better cleanup to prevent memory leaks
  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        setIsLoading(true);
        await fetchTemplateData();
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchTemplateData]);

  // Update the generated image when template submission succeeds
  useEffect(() => {
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      setIsImageLoading(false);
      
      // If we have processing time from the API response, record it
      if (processingTime && templateData) {
        setGenerationTime(processingTime);
        
        // Update the template history with this generation time
        setTemplateHistory(prev => ({
          ...prev,
          [templateData.template_type]: processingTime
        }));
        
        // Log the generation time
        if (isInitialized) {
          logEvent({
            type: 'INFO',
            message: 'Image generation time',
            details: {
              processingTime,
              templateType: templateData.template_type
            },
            sessionId,
            actionType: 'GENERATION_TIME_RECORDED'
          });
        }
      }
    }
  }, [imageUrl, processingTime, templateData, isInitialized, logEvent, sessionId]);

  // Handle generation complete from the timer component
  const handleGenerationComplete = useCallback((time: number) => {
    setGenerationTime(time);
    
    // Log with hook
    if (isInitialized && imageId && templateData) {
      logEvent({
        type: 'INFO',
        message: 'Image generation completed',
        details: {
          generationTimeMs: time,
          templateType: templateData.template_type
        },
        sessionId,
        imageId,
        actionType: 'IMAGE_GENERATION_COMPLETE'
      });
    }
  }, [isInitialized, logEvent, sessionId, imageId, templateData]);

  // Handle form submission 
  const handleFormSubmit = useCallback(async (formData: FormData) => {
    setIsImageLoading(true);
    setGenerationTime(null);
    
    // Log form submission start with the hook
    if (isInitialized) {
      logEvent({
        type: 'INFO',
        message: 'Form submission started',
        details: {
          template_type: formData.get("template_type"),
          timestamp: new Date().toISOString()
        },
        sessionId,
        actionType: 'FORM_SUBMISSION'
      });
    }
    
    try {
      // Use the template submission hook to submit the form
      const success = await submitTemplate(formData);
      
      if (success && imageUrl) {
        // If we received an imageId from the API, use it
        // Note: This logic would need to be updated based on your API response structure
        // For now, we're assuming no imageId in the response
        
        // Create an image record using the hook
        if (isInitialized && templateData) {
          try {
            // Create image record with the hook
            const imageRecord = await createGeneratedImage({
              path: imageUrl,
              sessionId,
              templateType: templateData.template_type,
              subtitle: formData.get("category") as string || formData.get("sub_text") as string,
              entity: templateData.entity,
              articleUrl: formData.get("artical_url") as string
            });
            
            if (imageRecord?._id) {
              setImageId(imageRecord._id);
              
              // Log success
              logEvent({
                type: 'SUCCESS',
                message: 'Image record created successfully',
                details: {
                  imageUrl: imageUrl,
                  imageId: imageRecord._id
                },
                sessionId,
                imageId: imageRecord._id,
                actionType: 'IMAGE_RECORD_CREATED'
              });
            }
          } catch (recordError) {
            // Log error
            logEvent({
              type: 'ERROR',
              message: 'Failed to create image record',
              details: recordError,
              sessionId,
              actionType: 'IMAGE_RECORD_CREATION_ERROR'
            });
          }
        }
      } else if (!success) {
        // Log error with hook
        if (isInitialized) {
          logEvent({
            type: 'ERROR',
            message: 'Image generation failed',
            details: {
              errorMessage: error || "Failed to generate image"
            },
            sessionId,
            actionType: 'IMAGE_GENERATION_ERROR'
          });
        }
      }
    } catch (submitError) {
      // Log error with hook
      if (isInitialized) {
        logEvent({
          type: 'ERROR',
          message: 'Form submission error',
          details: {
            error: submitError instanceof Error ? submitError.message : String(submitError)
          },
          sessionId,
          actionType: 'FORM_SUBMISSION_ERROR'
        });
      }
    }
  }, [
    createGeneratedImage, 
    error, 
    imageUrl, 
    isInitialized, 
    logEvent, 
    sessionId, 
    submitTemplate, 
    templateData
  ]);

  // Handle image loading complete
  const handleImageLoaded = useCallback(() => {
    setIsImageLoading(false);
    
    // Log with hook
    if (isInitialized && imageId) {
      logEvent({
        type: 'INFO',
        message: 'Image loaded in UI',
        sessionId,
        imageId,
        actionType: 'IMAGE_LOADED'
      });
    }
  }, [isInitialized, logEvent, sessionId, imageId]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setIsImageLoading(false);
    toast.error("Failed to load the generated image");
    
    // Log with hook
    if (isInitialized) {
      logEvent({
        type: 'ERROR',
        message: 'Failed to load image in UI',
        details: {
          imageUrl: generatedImage
        },
        sessionId,
        imageId,
        actionType: 'IMAGE_LOAD_ERROR'
      });
    }
  }, [generatedImage, isInitialized, logEvent, sessionId, imageId]);

  // Handle download
  const handleDownload = useCallback(async () => {
    // If no image or currently loading, don't do anything
    if (!generatedImage || isImageLoading) {
      return;
    }
  
    // First record the download
    if (imageId) {
      try {
        // Use the hook function if available
        if (isInitialized) {
          await recordImageDownload(imageId);
          
          // Log download event
          await logEvent({
            type: 'SUCCESS',
            message: 'Image downloaded',
            sessionId,
            imageId,
            actionType: 'IMAGE_DOWNLOAD'
          });
        }
      } catch (error) {
        // Log error
        if (isInitialized) {
          logEvent({
            type: 'ERROR',
            message: 'Failed to track download',
            details: error,
            sessionId,
            imageId,
            actionType: 'DOWNLOAD_TRACKING_ERROR'
          });
        }
      }
    }
  
    // Then trigger the download
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, imageId, isImageLoading, isInitialized, logEvent, recordImageDownload, sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!templateData) {
    return <div>Template not found</div>;
  }

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
      {/* Form Section */}
      <div className="card bg-white border rounded-lg shadow-sm">
        <div className="card-body flex flex-col p-6">
          <header className="flex mb-5 items-center border-b border-slate-100 pb-5 -mx-6 px-6">
            <div className="flex-1">
              <div className="card-title text-slate-900">
                {templateData.name}
              </div>
              <div className="text-xs text-slate-500">
                Entity: {templateData.entity}
              </div>
            </div>
          </header>
          
          {/* Use FormFactory to render the appropriate form */}
          <FormFactory
            templateData={templateData}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="card bg-white border rounded-lg shadow-sm">
        <div className="card-body flex flex-col p-6">
          <div className="card-text h-full">
            <div className="flex items-center justify-between mb-4">
              <h6 className="block text-base font-medium tracking-[0.01em] text-slate-500 uppercase">
                PREVIEW
              </h6>
            </div>
            
            {/* Generation Progress Timer */}
            {(isImageLoading || isSubmitting || generationTime || error) && (
              <div className="mb-4">
                <GenerationProgressTimer 
                  isGenerating={isImageLoading || isSubmitting} 
                  onComplete={handleGenerationComplete}
                  estimatedTime={templateData ? getEstimatedTime(templateData.template_type) : 5000}
                  hasError={!!error}
                  errorMessage={error || undefined}
                />
              </div>
            )}
            
            <div className="flex justify-center relative" style={{ minHeight: "300px" }}>
  {/* Image loading spinner - shown when isImageLoading is true and there is no error */}
  {(isImageLoading || isSubmitting) && !error && (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 rounded-md z-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )}
  
  {/* Error overlay - shown when there is an error */}
  {error && (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-80 rounded-md z-10 p-4">
      <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <div className="text-center text-red-600 max-w-[90%]">
        {/* Replace <br /> with line breaks */}
        {error.split('<br />').map((line, index) => (
          <p key={index} className="mb-1">{line}</p>
        ))}
      </div>
    </div>
  )}
  
  {generatedImage && !error ? (
    <Image
      src={generatedImage}
      alt="Generated image"
      width={500}
      height={300}
      className="rounded-md"
      id="NewImgSet"
      onLoadingComplete={handleImageLoaded}
      onError={handleImageError}
      priority
    />
  ) : (
    <Image
      src={templateData.image}
      alt="Template preview"
      width={500}
      height={300}
      className="rounded-md opacity-50"
      id="NewImgSet"
      onLoadingComplete={() => console.log("Template image loaded")}
      priority
    />
  )}
</div>
          </div>
          <br />
          <div className="inline-flex justify-center">
            <button
              className={`btn btn-outline-primary ${(!generatedImage || isImageLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              id="NewImgDownload"
              disabled={!generatedImage || isImageLoading || isSubmitting}
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      </div>
      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}