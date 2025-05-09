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

type ReformaWebNewsStory1FormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function ReformaWebNewsStory1Form({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: ReformaWebNewsStory1FormProps) {
  const [articleUrl, setArticleUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customTemplateType, setCustomTemplateType] = useState("web_news_story");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const router = useRouter();
  
  const handleTemplateTypeChange = (value: string) => {
    setCustomTemplateType(value);
    
    // Navigate to the appropriate template form
    if (value === "story_2") {
      router.push('/crm/platform/template-form/23');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      
      // Clear article URL when file is selected
      setArticleUrl("");
    }
  };
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Either file or article URL must be provided
    if (!selectedFile && !articleUrl.trim()) {
      newErrors.image = "Please provide either an image file or an article URL";
      toast.error("Please provide either an image file or an article URL");
      return false;
    }
    
    // Title is required ONLY if no article URL is provided
    if (!articleUrl.trim() && !title.trim()) {
      newErrors.title = "Title is required when not using an article URL";
      toast.error("Title is required when not using an article URL");
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
    
    // Add the template type
    formData.append("template_type", "reforma_web_news_story1");
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add custom template type
    formData.append("custom_template_type", customTemplateType);
    
    // Add article URL if provided
    if (articleUrl.trim()) {
      formData.append("artical_url", articleUrl);
    }
    
    // Add image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    // Add title
    formData.append("title", title);
    
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
        setSelectedFile(null);
        
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      
      {/* Template Type Radio Options */}
      <div className="flex justify-center">
        <RadioGroup 
          value={customTemplateType}
          onValueChange={handleTemplateTypeChange}
          className="flex items-center space-x-7 flex-wrap"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="web_news_story" id="story1" checked />
            <Label htmlFor="story1" className="text-secondary-500 text-sm leading-6">Story 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="story_2" id="story2" />
            <Label htmlFor="story2" className="text-secondary-500 text-sm leading-6">Story 2</Label>
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
          className={`form-control w-full px-3 py-2 border ${errors.image ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${selectedFile ? 'bg-slate-100' : ''}`}
          placeholder="Article URL" 
          value={articleUrl}
          onChange={(e) => {
            setArticleUrl(e.target.value);
            if (e.target.value) {
              setSelectedFile(null);
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              if (fileInput) {
                fileInput.value = "";
              }
            }
          }}
          disabled={!!selectedFile}
        />
      </div>
      
      <div className="input-area">
        <label className="form-label block text-sm font-medium text-slate-700 mb-1">-OR-</label>
      </div>
      
      {/* File upload field */}
      <div className="input-area">
        <div className="w-full relative">
          <label className={`cursor-pointer ${articleUrl ? 'opacity-50' : ''}`}>
            <input 
              type="file" 
              name="image" 
              className="hidden"
              onChange={handleFileChange}
              disabled={!!articleUrl}
            />
            <div className={`w-full h-[40px] flex items-center border ${errors.image ? 'border-red-500' : 'border-slate-300'} rounded-md overflow-hidden`}>
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3">
                {selectedFile ? (
                  <span className="text-slate-700">{selectedFile.name}</span>
                ) : (
                  <span className="text-slate-400">Choose a file or drop it here...</span>
                )}
              </span>
              <span className="flex-none border-l px-4 border-slate-200 h-full inline-flex items-center bg-slate-100 text-slate-600 text-sm rounded-tr rounded-br font-normal">
                Browse
              </span>
            </div>
          </label>
        </div>
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
        )}
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