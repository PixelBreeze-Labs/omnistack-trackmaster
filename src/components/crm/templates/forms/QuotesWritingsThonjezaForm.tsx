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

type QuotesWritingsThonjezaFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function QuotesWritingsThonjezaForm({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: QuotesWritingsThonjezaFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [title, setTitle] = useState("");
  const [showArrow, setShowArrow] = useState("show");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputLabel, setFileInputLabel] = useState("Choose a file or drop it here...");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const router = useRouter();
  
  const resetForm = () => {
    setTitle("");
    setSelectedFile(null);
    setFileInputLabel("Choose a file or drop it here...");
    setCropMode("square"); // Reset to default
    setShowArrow("show"); // Reset to default
    setErrors({}); // Clear any validation errors
  };
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Title is required
    if (!title.trim()) {
      newErrors.title = "Title is required";
      toast.error("Title is required");
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFileInputLabel(files[0].name);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) {
      return;
    }
    
    const formData = new FormData();
    
    // Add the template type
    formData.append("template_type", "quotes_writings_thonjeza");
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add crop mode
    formData.append("crop_mode", cropMode);
    
    // Add title
    formData.append("title", title);
    
    // Add show arrow option
    formData.append("show_arrow", showArrow);
    
    // Add image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success - COMMENTED OUT FOR MANUAL RESET
      // if (!isSubmitting) {
      //   setTitle("");
      //   setSelectedFile(null);
      //   setFileInputLabel("Choose a file or drop it here...");
      //   // Do not reset crop mode and show arrow to preserve user's choices
      // }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-text h-full space-y-4 text-center">
      {/* Crop Mode Radio Options */}
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
      
      {/* Title textarea */}
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
      
      {/* Show Arrow Radio Buttons */}
      <div className="input-area">
        <label htmlFor="show_arrow" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Show Arrow?
        </label>
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap gap-1">
            <div className="radio-button-wrapper">
              <input
                type="radio"
                id="show"
                name="show_arrow"
                value="show"
                checked={showArrow === "show"}
                onChange={() => setShowArrow("show")}
                className="hidden"
              />
              <label
                htmlFor="show"
                className={`min-w-[95px] cursor-pointer inline-block py-1 px-4 m-0.5 rounded-md border border-solid ${
                  showArrow === "show"
                    ? 'bg-primary text-white border-white'
                    : 'bg-transparent text-primary border-primary'
                }`}
              >
                Show
              </label>
            </div>
            <div className="radio-button-wrapper">
              <input
                type="radio"
                id="hide"
                name="show_arrow"
                value="hide"
                checked={showArrow === "hide"}
                onChange={() => setShowArrow("hide")}
                className="hidden"
              />
              <label
                htmlFor="hide"
                className={`min-w-[95px] cursor-pointer inline-block py-1 px-4 m-0.5 rounded-md border border-solid ${
                  showArrow === "hide"
                    ? 'bg-primary text-white border-white'
                    : 'bg-transparent text-primary border-primary'
                }`}
              >
                Hide
              </label>
            </div>
          </div>
        </div>
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