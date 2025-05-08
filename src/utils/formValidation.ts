export type ValidationRules = {
    rules: Record<string, any>;
    msg: Record<string, string>;
  };
  
  /**
   * Get validation rules for a specific form type
   * This replicates the PHP `getFormValidationRules` function
   */
  export function getFormValidationRules(formType: string): ValidationRules {
    const formRules: Record<string, ValidationRules> = {
      'feed_basic': {
        rules: {
          'title': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'feed_swipe': {
        rules: {
          // 'title': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          // 'title.max': 'The title may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'iconic_location': {
        rules: {
          // 'title': 'required|string|max:355',
          // 'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          // 'sub_text.required': 'The category is required.',
          // 'title.max': 'The title may not be greater than 355 characters.',
          // 'sub_text.max': 'The category may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'citim': {
        rules: {
          'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The citim is required.',
          'sub_text.required': 'The author is required.',
          'title.max': 'The citim may not be greater than 355 characters.',
          'sub_text.max': 'The author may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'web_news_story': {
        rules: {
          'title': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'feed_headline': {
        rules: {
          'title': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'logo_only': {
        rules: {
          'logo_position': 'required',
          'image': 'required|image|max:15000',
        },
        msg: {
          'logo_position.required': 'The logo position is required.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'web_news': {
        rules: {
          'title': 'required|string|max:355',
          // 'sub_text': 'required|string|max:355',
          // 'text_to_hl': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The category is required.',
          'text_to_hl.required': 'The text to highlight is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The subtitle may not be greater than 355 characters.',
          'text_to_hl.max': 'The text to highlight may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'feed_location': {
        rules: {
          // 'title': 'required|string|max:355',
          // 'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The category is required.',
          'location.required': 'The location is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The category may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'quotes_writings_art': {
        rules: {
          'title': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
        }
      },
      'quotes_writings_morning': {
        rules: {
          'title': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
        }
      },
      'quotes_writings_thonjeza': {
        rules: {
          'title': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
        }
      },
      'quotes_writings_citim': {
        rules: {
          'title': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
        }
      },
      'web_news_story_2': {
        rules: {
          'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The category is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The category may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'highlight': {
        rules: {
          // 'title': 'required|string|max:355',
          // 'text_to_hl': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          // 'text_to_hl.required': 'The text to highlight is required.',
          // 'title.max': 'The title may not be greater than 355 characters.',
          // 'text_to_hl.max': 'The text to highlight may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_quotes_writings': {
        rules: {
          'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The category is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The category may not be greater than 355 characters.',
        }
      },
      'reforma_new_quote': {
        rules: {
          'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The category is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The category may not be greater than 355 characters.',
        }
      },
      'reforma_feed_swipe': {
        rules: {
          'title': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'citim_version_2': {
        rules: {
          'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          'sub_text.required': 'The sub_text is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The sub_text may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_web_news_story_2': {
        rules: {
          // 'title': 'required|string|max:355',
          'sub_text': 'required|string|max:355',
          // 'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          'sub_text.required': 'The caption is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          'sub_text.max': 'The caption may not be greater than 355 characters.',
          // 'image.required': 'Image is required.',
          // 'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_news_feed': {
        rules: {
          'title': 'required|string|max:355',
          // 'sub_text': 'required|string|max:355',
          'image': 'required|image|max:15000',
        },
        msg: {
          'title.required': 'The title is required.',
          // 'sub_text.required': 'The category is required.',
          'title.max': 'The title may not be greater than 355 characters.',
          // 'sub_text.max': 'The category may not be greater than 355 characters.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_web_news_story1': {
        rules: {
          // 'title': 'required|string|max:355',
          // 'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          // 'title.max': 'The title may not be greater than 355 characters.',
          // 'image.required': 'Image is required.',
          // 'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_web_news_story2': {
        rules: {
          // 'title': 'required|string|max:355',
          // 'image': 'required|image|max:15000',
        },
        msg: {
          // 'title.required': 'The title is required.',
          // 'title.max': 'The title may not be greater than 355 characters.',
          // 'image.required': 'Image is required.',
          // 'image.max': 'The image may not be greater than 15000px.',
        }
      },
      'reforma_logo_only': {
        rules: {
          'logo_position': 'required',
          'image': 'required|image|max:15000',
        },
        msg: {
          'logo_position.required': 'The logo position is required.',
          'image.required': 'Image is required.',
          'image.max': 'The image may not be greater than 15000px.',
        }
      },
    };
  
    return formRules[formType] || { rules: {}, msg: {} };
  }
  
  /**
   * Validates form data against rules
   * @param data Form data to validate
   * @param rules Validation rules
   * @returns Object with validation result
   */
  export function validateForm(data: Record<string, any>, rules: ValidationRules): { 
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
  
    // Special case for web_news_story/web_news_story_2 with article URL
    if ((data.template_type === 'web_news_story' || 
         data.template_type === 'web_news_story_2' || 
         data.template_type === 'web_news') && 
        data.artical_url) {
      // If article URL is provided, only validate that
      if (!data.artical_url.trim()) {
        errors.push('Article URL is required for news templates');
      }
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // Process each rule
    Object.entries(rules.rules).forEach(([field, rule]) => {
      if (typeof rule === 'string') {
        const ruleList = rule.split('|');
        
        // Check required rule
        if (ruleList.includes('required')) {
          if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
            errors.push(rules.msg[`${field}.required`] || `The ${field} field is required.`);
          }
        }
        
        // Check max length rule for strings
        const maxRule = ruleList.find(r => r.startsWith('max:'));
        if (maxRule && data[field] && typeof data[field] === 'string') {
          const maxLength = parseInt(maxRule.split(':')[1]);
          if (data[field].length > maxLength) {
            errors.push(rules.msg[`${field}.max`] || `The ${field} exceeds maximum length of ${maxLength}.`);
          }
        }
        
        // Check image rule
        if (ruleList.includes('image') && field === 'image') {
          if (!data[field]) {
            errors.push(rules.msg[`${field}.required`] || `An ${field} is required.`);
          }
          // Note: Image size and type checks would be handled by the server or a file upload component
        }
      }
    });
  
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Gets article-specific validation rules
   */
  export function getArticleValidationRules(): ValidationRules {
    return {
      rules: {
        'artical_url': 'required|string|max:255',
      },
      msg: {
        'artical_url.required': 'The Article URL is required.'
      }
    };
  }