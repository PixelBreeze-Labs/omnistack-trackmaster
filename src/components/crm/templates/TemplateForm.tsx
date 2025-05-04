// src/components/crm/templates/TemplateForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import NewsStoryForm from "./forms/NewsStoryForm";
import NewsStory2Form from "./forms/NewsStory2Form";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
};

export default function TemplateForm({ templateId }: { templateId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Corrected template data structure
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
          description: "Template for news articles with headline and category"
        },
        14: {
          id: 14,
          name: "Web News Story 2",
          template_type: "web_news_story_2",
          image: "/images/templates/web_news_story_2.png",
          description: "Alternative layout for news articles"
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
      console.error("Failed to fetch template data:", error);
      toast.error("Failed to load template");
      setIsLoading(false);
    }
  };

    fetchTemplateData();
  }, [templateId, router]);

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Log submission for analytics
      console.log("Form submission started", {
        step: "submission_start",
        template_type: formData.get("template_type"),
        timestamp: new Date().toISOString()
      });

      // Make the API call to generate the image
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === 1) {
        // Success
        console.log("Generation successful", {
          step: "success",
          image: result.img,
          timestamp: new Date().toISOString()
        });
        
        setGeneratedImage(result.img);
        toast.success("Image generated successfully!");
      } else {
        // Error from business logic
        console.error("Business logic error", {
          type: "business_logic",
          message: result.msg,
          timestamp: new Date().toISOString()
        });
        
        toast.error(result.msg || "Failed to generate image");
      }
    } catch (error) {
      // Technical error
      console.error("API error", {
        type: "ajax_error",
        error,
        timestamp: new Date().toISOString()
      });
      
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex justify-center">
              {generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="Generated image"
                  width={500}
                  height={300}
                  className="rounded-md"
                  id="NewImgSet"
                />
              ) : (
                <Image
                  src={templateData.image}
                  alt="Template preview"
                  width={500}
                  height={300}
                  className="rounded-md opacity-50"
                  id="NewImgSet"
                />
              )}
            </div>
          </div>
          <br />
          <div className="inline-flex justify-center">
            <a
              className={`btn btn-outline-primary ${!generatedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              id="NewImgDownload"
              href={generatedImage || "#"}
              download={generatedImage ? "generated-image.jpg" : undefined}
              onClick={(e) => !generatedImage && e.preventDefault()}
            >
              Download
            </a>
          </div>
        </div>
      </div>
      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}