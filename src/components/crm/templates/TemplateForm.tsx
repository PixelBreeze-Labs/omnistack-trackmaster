"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import FormFactory from "@/components/crm/templates/forms/FormFactory";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";

// Define template data type
type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  description?: string;
  entity: string;
};

// Use a lookup table for template data
const TEMPLATE_DATA: Record<number, TemplateData> = {
  // IconStyle templates
  1: {
    id: 1,
    name: "Feed Basic",
    template_type: "feed_basic",
    image: "/images/templates/feed_basic.png",
    description: "Template for basic social media feeds",
    entity: "iconstyle"
  },
  2: {
    id: 2,
    name: "Feed Swipe",
    template_type: "feed_swipe",
    image: "/images/templates/feed_swipe.png",
    description: "Template for swipeable social media content",
    entity: "iconstyle"
  },
  3: {
    id: 3,
    name: "Iconic Location",
    template_type: "iconic_location",
    image: "/images/templates/iconic_location.png",
    description: "Template highlighting locations with iconic design",
    entity: "iconstyle"
  },
  4: {
    id: 4,
    name: "Citim",
    template_type: "citim",
    image: "/images/templates/citim.png",
    description: "Template for article quotes and citations",
    entity: "iconstyle"
  },
  5: {
    id: 5,
    name: "Web News Story",
    template_type: "web_news_story",
    image: "/images/templates/web_news_story.png",
    description: "Template for news articles with headline and category",
    entity: "iconstyle"
  },
  // Add all template definitions here
  14: {
    id: 14,
    name: "Web News Story 2",
    template_type: "web_news_story_2",
    image: "/images/templates/web_news_story_2.png",
    description: "Alternative layout for news articles",
    entity: "iconstyle"
  },
  19: {
    id: 19,
    name: "Citim 2",
    template_type: "citim_version_2",
    image: "/images/templates/citim_version_2.jpeg",
    description: "Updated citation template for Reforma",
    entity: "reforma"
  }
  // Add more templates as needed
};

export default function TemplateForm({ templateId }: { templateId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  const router = useRouter();
  
  // Initialize the hook
  const { 
    logEvent, 
    createGeneratedImage, 
    recordImageDownload,
    isInitialized 
  } = useGeneratedImages();

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

  // Handle form submission 
  const handleFormSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    setIsImageLoading(true);
    
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
      // Check if we're handling a file upload
      const fileInput = formData.get("image") as File | null;
      
      // If we have a file and it's a real file (not an empty input), we'll need to upload it
      if (fileInput && fileInput.size > 0) {
        // For now, we're just passing the file directly to the API
        // In a production environment, we might upload to Supabase or another storage first
        
        // Note: Your server API will need to handle multipart/form-data with files
        // If you're using Next.js API routes, you'll need formidable or similar
      }
      
      // Make the API call to generate the image
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === 1) {
        // Success
        setGeneratedImage(result.img);
        
        // If we received an imageId from the API, use it
        if (result.imageId) {
          setImageId(result.imageId);
          
          // Log success with hook
          if (isInitialized) {
            logEvent({
              type: 'SUCCESS',
              message: 'Image generated successfully',
              details: {
                imageUrl: result.img,
                imageId: result.imageId
              },
              sessionId,
              imageId: result.imageId,
              actionType: 'IMAGE_GENERATION_SUCCESS'
            });
          }
        } 
        // Otherwise, create an image record using the hook
        else if (isInitialized && templateData) {
          try {
            // Create image record with the hook
            const imageRecord = await createGeneratedImage({
              path: result.img,
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
                  imageUrl: result.img,
                  imageId: imageRecord._id
                },
                sessionId,
                imageId: imageRecord._id,
                actionType: 'IMAGE_RECORD_CREATED'
              });
            }
          } catch (error) {
            // Log error
            logEvent({
              type: 'ERROR',
              message: 'Failed to create image record',
              details: error,
              sessionId,
              actionType: 'IMAGE_RECORD_CREATION_ERROR'
            });
          }
        }
        
        toast.success("Image generated successfully!");
      } else {
        // Log error with hook
        if (isInitialized) {
          logEvent({
            type: 'ERROR',
            message: 'Image generation failed',
            details: {
              errorMessage: result.msg || "Failed to generate image",
              status: result.status
            },
            sessionId,
            actionType: 'IMAGE_GENERATION_ERROR'
          });
        }
        
        toast.error(result.msg || "Failed to generate image");
      }
    } catch (error) {
      // Log error with hook
      if (isInitialized) {
        logEvent({
          type: 'ERROR',
          message: 'API error',
          details: {
            error: error instanceof Error ? error.message : String(error)
          },
          sessionId,
          actionType: 'API_ERROR'
        });
      }
      
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsImageLoading(false);
    }
  }, [createGeneratedImage, isInitialized, logEvent, sessionId, templateData]);

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
            <h6 className="block text-base text-center font-medium tracking-[0.01em] text-slate-500 uppercase mb-6">
              PREVIEW
            </h6>
            <div className="flex justify-center relative" style={{ minHeight: "300px" }}>
              {/* Image loading spinner - shown when isImageLoading is true */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 rounded-md z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              )}
              
              {generatedImage ? (
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
              className={`btn btn-outline-primary ${(!generatedImage || isImageLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              id="NewImgDownload"
              disabled={!generatedImage || isImageLoading}
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