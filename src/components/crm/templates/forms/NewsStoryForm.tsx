// src/components/templates/forms/NewsStoryForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
};

type NewsStoryFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function NewsStoryForm({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: NewsStoryFormProps) {
  const [articleUrl, setArticleUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customTemplateType, setCustomTemplateType] = useState("web_news_story");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const router = useRouter();
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Article URL is required
    if (!articleUrl.trim()) {
      newErrors.articleUrl = "Article URL is required";
      toast.error("Article URL is required");
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) {
      return;
    }
    
    const formData = new FormData();
    
    // Add the base template type
    formData.append("template_type", templateData.template_type);
    
    // Add custom template type for switching between Story 1 and Story 2
    formData.append("custom_template_type", customTemplateType);
    
    // Add article URL
    formData.append("artical_url", articleUrl);
    
    // Add title if provided
    if (title.trim()) {
      formData.append("title", title);
    }
    
    // Add category if provided
    if (category.trim()) {
      formData.append("category", category);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!isSubmitting) {
        setTitle("");
        setArticleUrl("");
        setCategory("");
      }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const handleTemplateTypeChange = (value: string) => {
    setCustomTemplateType(value);
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      <div className="flex items-center space-x-7 flex-wrap justify-center">
        <div className="basicRadio">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              name="custom_template_type" 
              value="web_news_story" 
              checked={customTemplateType === "web_news_story"}
              onChange={() => handleTemplateTypeChange("web_news_story")}
            />
            <span className="flex-none bg-white rounded-full border inline-flex mr-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400">
              {customTemplateType === "web_news_story" && (
                <span className="absolute inset-0 m-auto w-[10px] h-[10px] rounded-full bg-primary-500"></span>
              )}
            </span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Story 1</span>
          </label>
        </div>
        <div className="basicRadio">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              name="custom_template_type" 
              value="story_2" 
              checked={customTemplateType === "story_2"}
              onChange={() => handleTemplateTypeChange("story_2")}
            />
            <span className="flex-none bg-white rounded-full border inline-flex mr-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400">
              {customTemplateType === "story_2" && (
                <span className="absolute inset-0 m-auto w-[10px] h-[10px] rounded-full bg-primary-500"></span>
              )}
            </span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Story 2</span>
          </label>
        </div>
      </div>
      
      {/* Information notice */}
      <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-4">
        <p className="font-medium">Notice: Image upload is temporarily disabled</p>
        <p className="text-sm mt-1">Currently, only Article URL mode is supported. Please provide an article URL to generate images.</p>
      </div>

      <div className="input-area">
        <label htmlFor="artical_url" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Article URL *
        </label>
        <input 
          id="artical_url" 
          name="artical_url" 
          type="text" 
          className={`form-control w-full px-3 py-2 border ${errors.articleUrl ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Article URL" 
          value={articleUrl}
          onChange={(e) => setArticleUrl(e.target.value)}
          required
        />
        {errors.articleUrl && (
          <p className="text-red-500 text-xs mt-1">{errors.articleUrl}</p>
        )}
      </div>
      
      <div className="input-area">
        <label htmlFor="title" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Title (Optional)
        </label>
        <textarea 
          id="title" 
          name="title" 
          rows={5} 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>
      </div>
      
      <div className="input-area">
        <label htmlFor="category" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Category (Optional)
        </label>
        <input 
          id="category" 
          name="category" 
          type="text" 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      
      <p className="text-sm text-slate-500">
        Fields marked with * are required.
      </p>
      
      <hr className="my-4" />
      
      <button 
        type="submit" 
        id="submitBtn" 
        className="btn inline-flex justify-center bg-primary text-white hover:bg-primary-600 py-2 px-4 rounded-md transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          "Create Image"
        )}
      </button>
      
      {/* Hidden input for base template_type */}
      <input type="hidden" name="template_type" value={templateData.template_type} />
    </form>
  );
}