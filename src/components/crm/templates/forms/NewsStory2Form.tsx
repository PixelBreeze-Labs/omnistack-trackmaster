"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  entity: string;
  description?: string;
};

type NewsStory2FormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function NewsStory2Form({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: NewsStory2FormProps) {
  const [articleUrl, setArticleUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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
    
    // Add the template type - always web_news_story_2 for this form
    formData.append("template_type", "web_news_story_2");
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Debug the entity data being sent
    console.log("Entity:", templateData.entity);
    
    // Add article URL
    formData.append("artical_url", articleUrl);
    
    // Add title
    if (title.trim()) {
      formData.append("title", title);
    }
    
    // Add description
    if (description.trim()) {
      formData.append("description", description);
    }
    
    // Add category
    if (category.trim()) {
      formData.append("category", category);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!isSubmitting) {
        setTitle("");
        setDescription("");
        setArticleUrl("");
        setCategory("");
      }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
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
          rows={3} 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>
      </div>
      
      <div className="input-area">
        <label htmlFor="description" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Description (Optional)
        </label>
        <textarea 
          id="description" 
          name="description" 
          rows={3} 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
    </form>
  );
}