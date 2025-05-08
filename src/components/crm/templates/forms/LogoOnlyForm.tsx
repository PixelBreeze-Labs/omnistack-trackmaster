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

type LogoOnlyFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function LogoOnlyForm({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: LogoOnlyFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [logoPosition, setLogoPosition] = useState("4");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const router = useRouter();
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // No specific validation needed for this form as there are no required text inputs
    
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
    formData.append("template_type", "logo_only");
    
    // Add entity type
    formData.append("entity", templateData.entity);
    
    // Add crop mode
    formData.append("crop_mode", cropMode);
    
    // Add logo position
    formData.append("logo_position", logoPosition);
    
    // Get the file input element and check if a file was selected
    const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }
    
    try {
      await onSubmit(formData);
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
      
      {/* File upload section */}
      <div className="input-area">
        <div className="w-full relative">
          <label className="cursor-pointer">
            <input 
              type="file" 
              name="image" 
              className="hidden"
              onChange={(e) => {
                // Handle file selection
                const file = e.target.files?.[0];
                if (file) {
                  // You might want to add file preview or validation here
                }
              }}
            />
            <div className="w-full h-[40px] flex items-center border border-slate-300 rounded-md overflow-hidden">
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3">
                <span className="text-slate-400">Choose a file or drop it here...</span>
              </span>
              <span className="flex-none border-l px-4 border-slate-200 h-full inline-flex items-center bg-slate-100 text-slate-600 text-sm rounded-tr rounded-br font-normal">Browse</span>
            </div>
          </label>
        </div>
      </div>
      
      {/* Logo Position Radio Buttons */}
      <div className="input-area text-center">
        <label htmlFor="logo_position" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Logo Position *
        </label>
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((position) => (
              <div key={position} className="radio-button-wrapper">
                <input
                  type="radio"
                  id={`position-${position}`}
                  name="logo_position"
                  value={position.toString()}
                  checked={logoPosition === position.toString()}
                  onChange={() => setLogoPosition(position.toString())}
                  className="hidden"
                />
                <label
                  htmlFor={`position-${position}`}
                  className={`min-w-[95px] cursor-pointer inline-block py-1 px-4 m-0.5 rounded-md border border-solid ${
                    logoPosition === position.toString()
                      ? 'bg-primary text-white border-white'
                      : 'bg-transparent text-primary border-primary'
                  }`}
                >
                  {position}
                </label>
              </div>
            ))}
          </div>
        </div>
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