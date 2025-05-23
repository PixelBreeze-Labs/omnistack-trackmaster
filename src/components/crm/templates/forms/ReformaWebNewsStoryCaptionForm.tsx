"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  entity: string;
  description?: string;
};

type ReformaWebNewsStoryCaptionFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function ReformaWebNewsStoryCaptionForm({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: ReformaWebNewsStoryCaptionFormProps) {
  const [cropMode, setCropMode] = useState("story");
  const [articleUrl, setArticleUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [fileName, setFileName] = useState("Choose a file or drop it here...");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const router = useRouter();
  
  const resetForm = () => {
    setTitle("");
    setArticleUrl("");
    setCaption("");
    setCategory("");
    setFileName("Choose a file or drop it here...");
    setCropMode("story"); // Reset to default
    setErrors({}); // Clear any validation errors
    
    const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Caption is always required
    if (!caption.trim()) {
      newErrors.caption = "Caption is required";
      toast.error("Caption is required");
    }
    
    // Title is only required if no article URL is provided
    if (!articleUrl.trim() && !title.trim()) {
      newErrors.title = "Title is required when not using an article URL";
      toast.error("Title is required when not using an article URL");
    }
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) {
      return;
    }
    
    const formData = new FormData();
    
    // Add the template type
    formData.append("template_type", "reforma_web_news_story_2");
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add crop mode
    formData.append("crop_mode", cropMode);
    
    // Add article URL if provided
    if (articleUrl.trim()) {
      formData.append("artical_url", articleUrl);
    }
    
    // Add title
    formData.append("title", title);
    
    // Add caption
    formData.append("sub_text", caption);
    
    // Add category if provided
    if (category.trim()) {
      formData.append("category", category);
    }
    
    // Get the file input element and check if a file was selected
    const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success - COMMENTED OUT FOR MANUAL RESET
      // if (!isSubmitting) {
      //   setTitle("");
      //   setArticleUrl("");
      //   setCaption("");
      //   setCategory("");
      //   setFileName("Choose a file or drop it here...");
      //   if (fileInput) {
      //     fileInput.value = "";
      //   }
      // }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("Choose a file or drop it here...");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      
      {/* Crop Mode Radio Options - Only Story is available/enabled */}
      <div className="flex justify-center">
        <RadioGroup 
          value={cropMode}
          onValueChange={setCropMode}
          className="flex items-center space-x-7 flex-wrap"
        >
          {/* Commented out options in original template - preserved the functionality */}
          {/*
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square" className="text-secondary-500 text-sm leading-6">Square</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portrait" id="portrait" />
            <Label htmlFor="portrait" className="text-secondary-500 text-sm leading-6">Portrait</Label>
          </div>
          */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="story" id="story" checked />
            <Label htmlFor="story" className="text-secondary-500 text-sm leading-6">Story</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="input-area">
        <label htmlFor="artical_url" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Article URL
        </label>
        <input 
          id="artical_url" 
          name="artical_url" 
          type="text" 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Article URL" 
          value={articleUrl}
          onChange={(e) => setArticleUrl(e.target.value)}
        />
      </div>
      
      <div className="input-area">
        <label className="form-label block text-sm font-medium text-slate-700 mb-1">-OR-</label>
      </div>
      
      {/* File upload */}
      <div className="input-area">
        <div className="w-full relative">
          <label className="cursor-pointer">
            <input 
              type="file" 
              name="image" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className="w-full h-[40px] flex items-center border border-slate-300 rounded-md overflow-hidden">
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3">
                <span className="text-slate-400">{fileName}</span>
              </span>
              <span className="flex-none border-l px-4 border-slate-200 h-full inline-flex items-center bg-slate-100 text-slate-600 text-sm rounded-tr rounded-br font-normal">Browse</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="input-area">
        <label htmlFor="title" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Title (Required if no article URL is provided)
        </label>
        <textarea 
          id="title" 
          name="title" 
          rows={5} 
          className={`form-control w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>
      
      <div className="input-area">
        <label htmlFor="caption" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Caption *
        </label>
        <input 
          id="caption" 
          name="sub_text" 
          type="text" 
          className={`form-control w-full px-3 py-2 border ${errors.caption ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        {errors.caption && (
          <p className="text-red-500 text-xs mt-1">{errors.caption}</p>
        )}
      </div>
      
      <div className="input-area">
        <label htmlFor="category" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Category
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
      
      <div className="flex gap-3 justify-center">
        <button 
          type="button" 
          onClick={resetForm}
          className="btn inline-flex justify-center bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 rounded-md transition-colors"
          disabled={isSubmitting}
        >
          Reset Form
        </button>
        
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
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Create Image"
          )}
        </button>
      </div>
    </form>
  );
}