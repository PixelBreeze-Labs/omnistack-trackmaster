"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  entity: string;
  description?: string;
};

type ReformaLogoOnlyFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function ReformaLogoOnlyForm({
  templateData,
  onSubmit,
  isSubmitting
}: ReformaLogoOnlyFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [logoPosition, setLogoPosition] = useState("4"); // Default position 4
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputLabel, setFileInputLabel] = useState("Choose a file or drop it here...");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Logo position is required
    if (!logoPosition) {
      newErrors.logoPosition = "Logo position is required";
      toast.error("Logo position is required");
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
    
    // Add logo position
    formData.append("logo_position", logoPosition);
    
    // Add image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!isSubmitting) {
        setSelectedFile(null);
        setFileInputLabel("Choose a file or drop it here...");
        // Keep the user's preferences for crop mode and logo position
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
      
      {/* Logo Position */}
      <div className="input-area text-center">
        <label htmlFor="logo_position" className="form-label">Logo Position *</label>
        <div className="radio-group" style={{ margin: 0 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((position) => (
            <React.Fragment key={position}>
              <input 
                type="radio" 
                value={position.toString()} 
                name="logo_position" 
                id={`logo_position_${position}`}
                checked={logoPosition === position.toString()}
                onChange={() => setLogoPosition(position.toString())}
              />
              <label htmlFor={`logo_position_${position}`}>{position}</label>
            </React.Fragment>
          ))}
        </div>
        {errors.logoPosition && (
          <p className="text-red-500 text-xs mt-1">{errors.logoPosition}</p>
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