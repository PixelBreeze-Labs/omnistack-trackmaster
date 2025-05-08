"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  entity: string;
  description?: string;
};

type ReformaQuotesWritingsFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function ReformaQuotesWritingsForm({
  templateData,
  onSubmit,
  isSubmitting
}: ReformaQuotesWritingsFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Title is required
    if (!title.trim()) {
      newErrors.title = "Title is required";
      toast.error("Title is required");
    }
    
    // Author is required
    if (!author.trim()) {
      newErrors.author = "Author is required";
      toast.error("Author is required");
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
    
    // Add template type
    formData.append("template_type", templateData.template_type);
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add crop mode
    formData.append("crop_mode", cropMode);
    
    // Add title
    formData.append("title", title);
    
    // Add author as sub_text
    formData.append("sub_text", author);
    
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!isSubmitting) {
        setTitle("");
        setAuthor("");
        // Keep the user's preferences for crop mode
      }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      {/* Crop Mode Selection */}
      <div className="flex items-center space-x-7 flex-wrap justify-center">
        <div className="basicRadio">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              name="crop_mode" 
              value="square" 
              checked={cropMode === "square"}
              onChange={() => setCropMode("square")}
            />
            <span className="flex-none bg-white dark:bg-slate-500 rounded-full border inline-flex ltr:mr-2 rtl:ml-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400 dark:border-slate-600 dark:ring-slate-700"></span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Square</span>
          </label>
        </div>
        <div className="basicRadio">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              name="crop_mode" 
              value="portrait" 
              checked={cropMode === "portrait"}
              onChange={() => setCropMode("portrait")}
            />
            <span className="flex-none bg-white dark:bg-slate-500 rounded-full border inline-flex ltr:mr-2 rtl:ml-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400 dark:border-slate-600 dark:ring-slate-700"></span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Portrait</span>
          </label>
        </div>
      </div>
      
      {/* Title */}
      <div className="input-area">
        <label htmlFor="title" className="form-label">Title *</label>
        <textarea 
          id="title"
          name="title"
          rows={5}
          className={`form-control w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></textarea>
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>
      
      {/* Author */}
      <div className="input-area">
        <label htmlFor="author" className="form-label">Author *</label>
        <input 
          id="author"
          name="sub_text"
          type="text"
          className={`form-control w-full px-3 py-2 border ${errors.author ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        {errors.author && (
          <p className="text-red-500 text-xs mt-1">{errors.author}</p>
        )}
      </div>
      
      <p>Fields marked with * are required!</p>
      <hr />
      <button 
        type="submit"
        id="submitBtn"
        className="btn inline-flex justify-center btn-outline-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Image"}
      </button>
    </form>
  );
}