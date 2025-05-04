// src/types/templates.ts

export enum TemplateType {
    WEB_NEWS_STORY = "web_news_story",
    WEB_NEWS_STORY_2 = "web_news_story_2",
    QUOTES_WRITINGS_ART = "quotes_writings_art",
    QUOTES_WRITINGS_MORNING = "quotes_writings_morning", 
    QUOTES_WRITINGS_THONJEZA = "quotes_writings_thonjeza",
    QUOTES_WRITINGS_CITIM = "quotes_writings_citim"
  }
  
  export interface Template {
    id: number;
    name: string;
    template_type: TemplateType | string;
    image: string;
    description?: string;
  }
  
  export interface TemplateResponse {
    status: number;
    msg?: string;
    img?: string;
  }
  
  export interface ValidationRules {
    rules: Record<string, string>;
    msg: Record<string, string>;
  }
  
  // Define validation rules for different template types
  export const getFormValidationRules = (templateType: string): ValidationRules => {
    const rules: Record<string, ValidationRules> = {
      [TemplateType.WEB_NEWS_STORY]: {
        rules: {
          title: 'required|string|max:255',
          image: 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
        },
        msg: {
          'title.required': 'The title is required.',
          'image.required': 'Please upload an image.',
          'image.mimes': 'The image must be a file of type: jpeg, png, jpg, gif.',
          'image.max': 'The image may not be greater than 2MB.',
        },
      },
      [TemplateType.WEB_NEWS_STORY_2]: {
        rules: {
          title: 'required|string|max:255',
          image: 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
        },
        msg: {
          'title.required': 'The title is required.',
          'image.required': 'Please upload an image.',
          'image.mimes': 'The image must be a file of type: jpeg, png, jpg, gif.',
          'image.max': 'The image may not be greater than 2MB.',
        },
      },
      // Add more rules for other template types as needed
    };
  
    return rules[templateType] || {
      rules: {
        title: 'required|string|max:255',
      },
      msg: {
        'title.required': 'The title is required.',
      },
    };
  };
  
  // Function to get template names and data - can be expanded as needed
  export const getTemplateNames = (): Record<number, Template> => {
    return {
      21: {
        id: 21,
        name: "Web News Story 1",
        template_type: TemplateType.WEB_NEWS_STORY,
        image: "/images/templates/web_news_story.png",
        description: "Template for news articles with headline and category"
      },
      23: {
        id: 23,
        name: "Web News Story 2",
        template_type: TemplateType.WEB_NEWS_STORY_2,
        image: "/images/templates/web_news_story_2.png",
        description: "Alternative layout for news articles"
      },
      // Add more templates as needed
    };
  };