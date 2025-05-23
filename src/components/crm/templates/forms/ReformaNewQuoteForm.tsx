"use client";

import { useState } from "react";
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

type ReformaNewQuoteFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function ReformaNewQuoteForm({
  templateData,
  onSubmit,
  isSubmitting
}: ReformaNewQuoteFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCropMode("square"); // Reset to default
    setErrors({}); // Clear any validation errors
  };
  
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
      // Reset form on success - COMMENTED OUT FOR MANUAL RESET
      // if (!isSubmitting) {
      //   setTitle("");
      //   setAuthor("");
      //   // Keep the user's preferences for crop mode
      // }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      {/* Crop Mode Selection - Using Radix UI RadioGroup */}
      <div className="flex justify-center">
        <RadioGroup 
          value={cropMode}
          onValueChange={setCropMode}
          className="flex items-center space-x-7 flex-wrap"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square" className="text-secondary-500 text-sm leading-6">Square</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portrait" id="portrait" />
            <Label htmlFor="portrait" className="text-secondary-500 text-sm leading-6">Portrait</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Title */}
      <div className="input-area">
        <label htmlFor="title" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
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
        <label htmlFor="author" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Author *
        </label>
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
      
      <p className="text-sm text-slate-500">
        Fields marked with * are required!
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