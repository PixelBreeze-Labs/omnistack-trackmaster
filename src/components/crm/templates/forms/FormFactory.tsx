"use client";

import React from 'react';
import { GeneratedImage, EntityType } from '@/app/api/external/omnigateway/types/generatedImage';

interface TemplateFormData {
    id: number;
    name: string;
    template_type: string;
    image: string;
    description?: string;
    entity: EntityType;
  }

// Import all form components
import NewsStoryForm from './NewsStoryForm';
import NewsStory2Form from './NewsStory2Form';
import CitimForm from './CitimForm';
import CitimVersion2Form from './CitimVersion2Form';
import FeedBasicForm from './FeedBasicForm';
import FeedHeadlineForm from './FeedHeadlineForm';
import FeedLocationForm from './FeedLocationForm';
import FeedSwipeForm from './FeedSwipeForm';
import FeedsIconicForm from './FeedsIconicForm';

// Props for the FormFactory component
interface FormFactoryProps {
  templateData: TemplateFormData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * FormFactory component renders the appropriate form based on the template type
 */
export default function FormFactory({ 
  templateData, 
  onSubmit, 
  isSubmitting 
}: FormFactoryProps) {
  // Render the appropriate form based on template type
  switch (templateData.template_type) {
    case 'web_news_story':
      return (
        <NewsStoryForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'web_news_story_2':
      return (
        <NewsStory2Form 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'citim':
      return (
        <CitimForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'citim_version_2':
      return (
        <CitimVersion2Form 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'feed_basic':
      return (
        <FeedBasicForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'feed_headline':
      return (
        <FeedHeadlineForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'feed_location':
      return (
        <FeedLocationForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'feed_swipe':
      return (
        <FeedSwipeForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    case 'feeds_iconic':
      return (
        <FeedsIconicForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
      
    default:
      // Fallback for unsupported template types
      return (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          <h3 className="font-medium mb-2">Form not available</h3>
          <p>No form component found for template type: {templateData.template_type}</p>
          <p className="mt-2">Available templates: web_news_story, web_news_story_2, citim, citim_version_2, feed_basic, feed_headline, feed_location, feed_swipe, feeds_iconic</p>
        </div>
      );
  }
}