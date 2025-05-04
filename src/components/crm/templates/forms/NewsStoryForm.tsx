// src/components/crm/templates/forms/NewsStoryForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const [uploadedFileName, setUploadedFileName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title) {
      alert("Title is required");
      return;
    }
    
    // If neither URL nor file is provided
    if (!articleUrl && !fileInputRef.current?.files?.length && templateData.template_type === "web_news_story") {
      alert("Please provide either an Article URL or upload a file");
      return;
    }
    
    const formData = new FormData();
    formData.append("template_type", templateData.template_type);
    formData.append("title", title);
    formData.append("category", category);
    
    if (articleUrl) {
      formData.append("artical_url", articleUrl);
    }
    
    if (fileInputRef.current?.files?.length) {
      formData.append("image", fileInputRef.current.files[0]);
    }
    
    await onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    } else {
      setUploadedFileName("");
    }
  };

  const handleTemplateTypeChange = (value: string) => {
    // Navigate to the new template
    const templateIds: Record<string, number> = {
      "web_news_story": 21,
      "story_2": 23,
    };
    
    if (templateIds[value]) {
      router.push(`/crm/platform/template-form/${templateIds[value]}`);
    }
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
              checked={templateData.template_type === "web_news_story"}
              onChange={() => handleTemplateTypeChange("web_news_story")}
            />
            <span className="flex-none bg-white rounded-full border inline-flex mr-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400">
              {templateData.template_type === "web_news_story" && (
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
              checked={templateData.template_type === "web_news_story_2"}
              onChange={() => handleTemplateTypeChange("story_2")}
            />
            <span className="flex-none bg-white rounded-full border inline-flex mr-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400">
              {templateData.template_type === "web_news_story_2" && (
                <span className="absolute inset-0 m-auto w-[10px] h-[10px] rounded-full bg-primary-500"></span>
              )}
            </span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Story 2</span>
          </label>
        </div>
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
      
      <div className="input-area">
        <div className="filegroup">
          <label className="block">
            <input 
              type="file" 
              className="w-full hidden" 
              name="image"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <span className="w-full h-[40px] file-control flex items-center custom-class border border-slate-300 rounded-md overflow-hidden">
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3">
                {uploadedFileName ? (
                  <span>{uploadedFileName}</span>
                ) : (
                  <span className="text-slate-400">Choose a file or drop it here...</span>
                )}
              </span>
              <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 h-full inline-flex items-center bg-slate-100 text-slate-600 text-sm rounded-tr rounded-br font-normal">
                Browse
              </span>
            </span>
          </label>
        </div>
      </div>
      
      <div className="input-area">
        <label htmlFor="title" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Title * 
        </label>
        <textarea 
          id="title" 
          name="title" 
          rows={5} 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></textarea>
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
      
      <p className="text-sm text-slate-500">Fields marked with * are required!</p>
      
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
      
      {/* Hidden input for template_type */}
      <input type="hidden" name="template_type" value={templateData.template_type} />
    </form>
  );
}