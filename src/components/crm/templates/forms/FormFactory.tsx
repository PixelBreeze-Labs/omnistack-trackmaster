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
import WebNewsForm from './WebNewsForm';
import ReformaLogoOnlyForm from './ReformaLogoOnlyForm';
import ReformaNewQuoteForm from './ReformaNewQuoteForm';
import ReformaQuotesWritingsForm from './ReformaQuotesWritingsForm';
import ReformaWebNewsStory1Form from './ReformaWebNewsStory1Form';
import ReformaWebNewsStory2Form from './ReformaWebNewsStory2Form';
import ReformaFeedSwipeForm from './ReformaFeedSwipeForm';
import ReformaNewsFeedForm from './ReformaNewsFeedForm';
import QuotesWritingsArtForm from './QuotesWritingsArtForm';
import QuotesWritingsMorningForm from './QuotesWritingsMorningForm';
import QuotesWritingsThonjezaForm from './QuotesWritingsThonjezaForm';
import QuotesWritingsCitimForm from './QuotesWritingsCitimForm';
import HighlightForm from './HighlightForm';
import ReformaWebNewsStoryCaptionForm from './ReformaWebNewsStoryCaptionForm';
import LogoOnlyForm from './LogoOnlyForm';
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
    // IconStyle Templates
    case 'feed_basic':
      return (
        <FeedBasicForm 
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

    case 'iconic_location':
    return (
    <FeedsIconicForm 
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

    case 'web_news_story':
      return (
        <NewsStoryForm 
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

    case 'logo_only':
        return (
        <LogoOnlyForm 
            templateData={templateData} 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
        />
        );

    case 'web_news':
        return (
            <WebNewsForm 
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
    
    case 'quotes_writings_art':
        return (
          <QuotesWritingsArtForm 
            templateData={templateData} 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
          />
        );
    
    case 'quotes_writings_morning':
      return (
        <QuotesWritingsMorningForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
    
    case 'quotes_writings_thonjeza':
      return (
        <QuotesWritingsThonjezaForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
    
    case 'quotes_writings_citim':
      return (
        <QuotesWritingsCitimForm 
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
       
    case 'highlight':
      return (
        <HighlightForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
  
      
    // Reforma Templates
    case 'reforma_quotes_writings':
      return (
        <ReformaQuotesWritingsForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );
    
    case 'reforma_new_quote':
    return (
        <ReformaNewQuoteForm 
        templateData={templateData} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
        />
    );

    case 'reforma_feed_swipe':
      return (
        <ReformaFeedSwipeForm
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
    
    case 'reforma_news_feed':
    return (
        <ReformaNewsFeedForm 
        templateData={templateData} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting}
    />
    );  

    case 'reforma_web_news_story1':
      return (
        <ReformaWebNewsStory1Form 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );

    case 'reforma_web_news_story_2':
      return (
        <ReformaWebNewsStoryCaptionForm 
          templateData={templateData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
        />
      );

    case 'reforma_web_news_story2':
    return (
        <ReformaWebNewsStory2Form 
        templateData={templateData} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
        />
    );

    case 'reforma_logo_only':
    return (
        <ReformaLogoOnlyForm 
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
          <p className="mt-2">Available templates include web_news_story, web_news_story_2, citim, citim_version_2, feed_basic, feed_headline, feed_location, feed_swipe, iconic_location, web_news, reforma_logo_only, reforma_new_quote, reforma_quotes_writings, reforma_web_news_story1, reforma_web_news_story2</p>
        </div>
      );
  }
}