"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import NewsStoryForm from "./forms/NewsStoryForm";
import NewsStory2Form from "./forms/NewsStory2Form";
import { useGeneratedImages } from "@/hooks/useGeneratedImages"; // Import the hook

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  description?: string;
  entity: string;
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

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // This would normally come from your API
        // For now, we'll use static data based on the templateId
        const templates: Record<number, TemplateData> = {
          5: {
            id: 5,
            name: "Web News Story 1",
            template_type: "web_news_story",
            image: "/images/templates/web_news_story.png",
            description: "Template for news articles with headline and category",
            entity: "iconstyle"
          },
          14: {
            id: 14,
            name: "Web News Story 2",
            template_type: "web_news_story_2",
            image: "/images/templates/web_news_story_2.png",
            description: "Alternative layout for news articles",
            entity: "iconstyle"
          },
          // Add more templates as needed
        };
    
        // Check if template exists
        if (!templates[templateId]) {
          toast.error("Template not found");
          router.push("/crm/platform/templates");
          return;
        }
    
        setTemplateData(templates[templateId]);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load template");
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [templateId, router]);

  const handleFormSubmit = async (formData: FormData) => {
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
      // Add entity to the form data
      if (templateData?.entity) {
        formData.append("entity", templateData.entity);
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
              subtitle: formData.get("category") as string || formData.get("description") as string,
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
        setIsImageLoading(false);
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
      setIsImageLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the image loading completion
  const handleImageLoaded = () => {
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
  };

  // Handle image loading error
  const handleImageError = () => {
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
  };

  const handleDownload = async () => {
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
  };
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

  // Render the appropriate form based on template type
  const renderForm = () => {
    switch (templateData.id) {
      case 5:
        // For Web News Story 1 (ID 5)
        return (
          <NewsStoryForm 
            templateData={templateData} 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting} 
          />
        );
      case 14:
        // For Web News Story 2 (ID 14)
        return (
          <NewsStory2Form 
            templateData={templateData} 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting} 
          />
        );
      default:
        return <div>Unsupported template type</div>;
    }
  };

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
          {renderForm()}
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