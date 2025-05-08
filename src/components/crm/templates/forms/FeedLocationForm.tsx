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

type FeedLocationFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function FeedLocationForm({
  templateData,
  onSubmit,
  isSubmitting
}: FeedLocationFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [showArrow, setShowArrow] = useState("show");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputLabel, setFileInputLabel] = useState("Choose a file or drop it here...");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Title is required
    if (!title.trim()) {
      newErrors.title = "Title is required";
      toast.error("Title is required");
    }
    
    // Location is required
    if (!location.trim()) {
      newErrors.location = "Location is required";
      toast.error("Location is required");
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
    
    // Add template type
    formData.append("template_type", templateData.template_type);
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add crop mode
    formData.append("crop_mode", cropMode);
    
    // Add title
    formData.append("title", title);
    
    // Add location
    formData.append("location", location);
    
    // Add show arrow setting
    formData.append("show_arrow", showArrow);
    
    // Add image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!isSubmitting) {
        setTitle("");
        setLocation("");
        setSelectedFile(null);
        setFileInputLabel("Choose a file or drop it here...");
        // Keep the user's preferences for crop mode and show arrow
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
        <div className="basicRadio">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="hidden" 
              name="crop_mode" 
              value="story" 
              checked={cropMode === "story"}
              onChange={() => setCropMode("story")}
            />
            <span className="flex-none bg-white dark:bg-slate-500 rounded-full border inline-flex ltr:mr-2 rtl:ml-2 relative transition-all duration-150 h-[16px] w-[16px] border-slate-400 dark:border-slate-600 dark:ring-slate-700"></span>
            <span className="text-secondary-500 text-sm leading-6 capitalize">Story</span>
          </label>
        </div>
      </div>
      
      {/* Article URL - Disabled for now */}
      <div className="input-area">
        <label htmlFor="article_url" className="form-label">Article URL</label>
        <input 
          id="article_url" 
          type="text" 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 bg-slate-100"
          placeholder="Article URL" 
          disabled
        />
      </div>
      
      <div className="input-area">
        <label className="form-label">-OR-</label>
      </div>
      
      {/* File Upload */}
      <div className="input-area">
        <div className="filegroup">
          <label>
            <input 
              type="file"
              className="w-full hidden"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <span className="w-full h-[40px] file-control flex items-center custom-class">
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className={selectedFile ? "text-slate-600" : "text-slate-400"}>
                  {fileInputLabel}
                </span>
              </span>
              <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm rounded-tr rounded-br font-normal">
                Browse
              </span>
            </span>
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
      
      {/* Location */}
      <div className="input-area">
        <label htmlFor="location" className="form-label">Location *</label>
        <input 
          id="location"
          name="location"
          type="text"
          className={`form-control w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
      
      {/* Show Arrow */}
      <div className="input-area">
        <label htmlFor="show_arrow" className="form-label">Show Arrow?</label>
        <div className="radio-group" style={{ margin: 0 }}>
          <input 
            type="radio" 
            value="show" 
            name="show_arrow" 
            id="show" 
            checked={showArrow === "show"}
            onChange={() => setShowArrow("show")}
          />
          <label htmlFor="show">Show</label>
          <input 
            type="radio" 
            value="hide" 
            name="show_arrow" 
            id="hide"
            checked={showArrow === "hide"}
            onChange={() => setShowArrow("hide")}
          />
          <label htmlFor="hide">Hide</label>
        </div>
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