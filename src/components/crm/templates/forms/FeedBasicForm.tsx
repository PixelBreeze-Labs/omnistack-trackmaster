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

type FeedBasicFormProps = {
  templateData: TemplateData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function FeedBasicForm({
  templateData,
  onSubmit,
  isSubmitting
}: FeedBasicFormProps) {
  const [cropMode, setCropMode] = useState("square");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showArrow, setShowArrow] = useState("show");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputLabel, setFileInputLabel] = useState("Choose a file or drop it here...");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [spellcheckSuggestion, setSpellcheckSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Title is required
    if (!title.trim()) {
      newErrors.title = "Title is required";
      toast.error("Title is required");
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
  
  const checkSpelling = async (button: HTMLButtonElement, version = 1) => {
    const form = button.closest('form');
    if (!form) return;
    
    const textInput = form.querySelector('.text-suggest') as HTMLTextAreaElement;
    if (!textInput || !textInput.value.trim()) return;
    
    try {
      const response = await fetch(`/api/templates/spellcheck${version === 2 ? '-v2' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput.value }),
      });
      
      const data = await response.json();
      if (data.suggestion) {
        setSpellcheckSuggestion(data.suggestion);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error('Spellcheck error:', error);
    }
  };
  
  const applySuggestion = () => {
    setTitle(spellcheckSuggestion);
    setShowSuggestion(false);
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
    
    // Add subtitle as sub_text if provided
    if (subtitle.trim()) {
      formData.append("sub_text", subtitle);
    }
    
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
        setSubtitle("");
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="story" id="story" />
            <Label htmlFor="story" className="text-secondary-500 text-sm leading-6">Story</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Article URL - Disabled for now */}
      <div className="input-area">
        <label htmlFor="article_url" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Article URL
        </label>
        <input 
          id="article_url" 
          type="text" 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 bg-slate-100"
          placeholder="Article URL" 
          disabled
        />
      </div>
      
      <div className="input-area">
        <label className="form-label block text-sm font-medium text-slate-700 mb-1">-OR-</label>
      </div>
      
      {/* File Upload */}
      <div className="input-area">
        <div className="filegroup">
          <label className="block">
            <input 
              type="file" 
              className="w-full hidden" 
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <span className="w-full h-[40px] file-control flex items-center custom-class border border-slate-300 rounded-md overflow-hidden">
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3">
                <span className={`${selectedFile ? 'text-slate-700' : 'text-slate-400'}`}>
                  {fileInputLabel}
                </span>
              </span>
              <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 h-full inline-flex items-center bg-slate-100 text-slate-600 text-sm rounded-tr rounded-br font-normal">
                Browse
              </span>
            </span>
          </label>
        </div>
      </div>
      
      {/* Title */}
      <div className="input-area">
        <label htmlFor="title" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
        {showSuggestion && (
          <div className="alert alert-success light-mode suggestion mb-2 bg-green-50 p-3 rounded-md">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-2xl flex-0">🎯</span>
              <p className="flex-1 font-Inter cursor-pointer" onClick={applySuggestion}>
                Did you mean: <span>{spellcheckSuggestion}</span>
              </p>
              <div className="flex-0 text-xl cursor-pointer" onClick={() => setShowSuggestion(false)}>
                ✕
              </div>
            </div>
          </div>
        )}
        <textarea 
          id="title" 
          name="title" 
          rows={5} 
          className={`form-control text-suggest w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></textarea>
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
        
        {/* <div className="flex space-x-2 mt-2">
          <button 
            type="button" 
            className="btn inline-flex justify-center bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 py-1 px-3 rounded-md transition-colors text-sm"
            onClick={(e) => checkSpelling(e.currentTarget, 2)}
          > 
            <span className="flex items-center">
              <span>Spellcheck (Other tool)</span>
              <span className="text-xl ml-2">📝</span>
            </span>
          </button>
        </div> */}
      </div>
      
      {/* Subtitle */}
      {/* <div className="input-area">
        <label htmlFor="subtitle" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Subtitle
        </label>
        <textarea 
          id="subtitle" 
          name="sub_text" 
          rows={2} 
          className="form-control w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        ></textarea>
      </div> */}
      
      {/* Show Arrow */}
      <div className="input-area">
        <label htmlFor="show_arrow" className="form-label block text-sm font-medium text-slate-700 mb-1">
          Show Arrow?
        </label>
        <div className="flex justify-center">
          <RadioGroup 
            value={showArrow}
            onValueChange={setShowArrow}
            className="flex items-center space-x-7"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="show" id="show" />
              <Label htmlFor="show" className="text-secondary-500 text-sm leading-6">Show</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hide" id="hide" />
              <Label htmlFor="hide" className="text-secondary-500 text-sm leading-6">Hide</Label>
            </div>
          </RadioGroup>
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