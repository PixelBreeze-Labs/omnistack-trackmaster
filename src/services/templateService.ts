/**
 * Next.js implementation of the PHP TemplateService
 * This service handles preparing and submitting template data to the API
 */

export type TemplateResponse = {
  status: number;
  msg?: string;
  img?: string;
};

export class TemplateService {
  private readonly API_URL = process.env.NEXT_PYTHON_API_URL || 'https://stageapi.pixelbreeze.xyz/generate';
  private readonly PHP_UPLOAD_URL = process.env.PHP_UPLOAD_URL || 'https://stageadmin.pixelbreeze.xyz/upload-file';
  private readonly STORAGE_DOMAIN = 'https://stageadmin.pixelbreeze.xyz';
  private readonly OUTPUT_DIR = '/var/www/html/stageadmin.pixelbreeze.xyz/storage/app/public/uploads';

  /**
   * Process a template submission
   */
  async processTemplate(formData: FormData): Promise<TemplateResponse> {
    try {
      // Extract basic template data
      const templateType = formData.get('template_type') as string;
      const customTemplateType = formData.get('custom_template_type') as string | null;
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const category = formData.get('category') as string | null;
      const articleUrl = formData.get('artical_url') as string | null;
      const subText = formData.get('sub_text') as string | null;
      const cropMode = formData.get('crop_mode') as string | null;
      const showArrow = formData.get('show_arrow') as string | null;
      const location = formData.get('location') as string | null;
      const file = formData.get('image') as File | null;
      const logoPosition = formData.get('logo_position') as string | null;
      const textToHighlight = formData.get('text_to_hl') as string | null;

      // Check article URL requirement for news templates
      if ((templateType === 'web_news_story' || templateType === 'web_news_story_2') && !articleUrl && !file) {
        return {
          status: 0,
          msg: "Please provide either an Article URL or an image file"
        };
      }

      // Create API form data
      const apiFormData = new FormData();
      
      // Session ID
      const sessionId = 'session_' + Date.now();
      apiFormData.append('session_id', sessionId);
      
      // Generate output filename and path
      const timestamp = Date.now();
      const outputImageName = `output_${timestamp}.jpg`;
      const outputPath = `${this.OUTPUT_DIR}/${outputImageName}`;
      apiFormData.append('output_img_path', outputPath);
      
      // Handle file upload if provided
      let fileUploadPath = '';
      if (file && file.size > 0) {
        try {
          // Create file upload form data
          const fileFormData = new FormData();
          fileFormData.append('file', file);
          
          // Upload file to PHP endpoint
          const uploadResponse = await fetch(this.PHP_UPLOAD_URL, {
            method: 'POST',
            body: fileFormData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`File upload failed: ${uploadResponse.status}`);
          }
          
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.status !== 1) {
            throw new Error(uploadResult.message || 'File upload failed');
          }
          
          // Get file path from upload response
          fileUploadPath = uploadResult.file_path;
          
          // Add the file path to the API form data
          apiFormData.append('input_img_path', fileUploadPath);
        } catch (uploadError) {
          console.log('File upload error:', uploadError);
          return {
            status: 0,
            msg: "Failed to upload file"
          };
        }
      }
      
      // Handle article URL if provided
      if (articleUrl) {
        apiFormData.append('artical_url', articleUrl);
        apiFormData.append('IsArticle', '1');
      }
      
      // Add crop mode if provided
      if (cropMode) {
        apiFormData.append('crop_mode', cropMode);
      }
      
      // Handle different template types
      this.prepareTemplateSpecificData(
        apiFormData, 
        templateType, 
        customTemplateType,
        title,
        description,
        category,
        subText,
        showArrow,
        location,
        logoPosition,
        textToHighlight
      );

      console.log('apiFormData', apiFormData);
      
      // Call the Python API
      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: apiFormData,
      });
      
      // Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Python API error:', errorText);
        
        return {
          status: 0,
          msg: `Image generation failed: ${response.status}`,
        };
      }
      
      // Process successful response
      const result = await response.json();
      
      // Construct URL to the generated image
      const imageUrl = `${this.STORAGE_DOMAIN}/storage/uploads/${outputImageName}`;
      
      return {
        status: 1,
        msg: "Image generated successfully",
        img: imageUrl
      };
      
    } catch (error) {
      console.error('Generation error:', error);
      
      return {
        status: 0,
        msg: "An error occurred while processing your request"
      };
    }
  }

  /**
   * Prepare template-specific data for the API request
   */
  private prepareTemplateSpecificData(
    apiFormData: FormData,
    templateType: string,
    customTemplateType: string | null,
    title: string | null,
    description: string | null,
    category: string | null,
    subText: string | null,
    showArrow: string | null,
    location: string | null,
    logoPosition: string | null,
    textToHighlight: string | null
  ): void {
    console.log('templateType', templateType);
    console.log('customTemplateType', customTemplateType);
    // Set base template type
    apiFormData.append('template_type', templateType);

    // Handle different template types
    switch (templateType) {
      case 'web_news_story':
        // For Web News Story
        if (customTemplateType) {
          // First, remove the existing template_type
          apiFormData.delete('template_type');
          // Then set the new template_type to the customTemplateType value
          apiFormData.append('template_type', customTemplateType);
        } else {
          // If no custom type, keep the original
          apiFormData.append('template_type', templateType);
        }
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add category as sub_text 
        if (category) {
          apiFormData.append('sub_text', category);
        }
        
        // Override crop mode for news stories
        apiFormData.append('crop_mode', 'story');
        break;
        
      case 'web_news_story_2':
        // For Web News Story 2
        apiFormData.append('template_type', 'web_news_story_2');
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add description as sub_text
        if (description) {
          apiFormData.append('sub_text', description);
        }
        
        // Add category
        if (category) {
          apiFormData.append('category', category);
        }
        
        // Override crop mode for news stories
        apiFormData.append('crop_mode', 'story');
        break;
        
      case 'citim':
      case 'citim_version_2':
        // For Citim templates
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add author as sub_text
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        break;
        
      case 'feed_basic':
        // For Feed Basic template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add subtitle as sub_text
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;
        
      case 'feed_headline':
        // For Feed Headline template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add subtitle as sub_text
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        else {
          apiFormData.append('sub_text', '');
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;
        
      case 'feed_location':
        // For Feed Location template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add location
        if (location) {
          apiFormData.append('location', location);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;
        
      case 'feed_swipe':
        // For Feed Swipe template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;
        
      case 'iconic_location':
        // For Feeds Iconic template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        break;

      case 'highlight':
        // For Highlight template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add text to highlight
        if (textToHighlight) {
          apiFormData.append('text_to_hl', textToHighlight);
        }

        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'web_news':
        // For Web News template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add text to highlight
        if (textToHighlight) {
          apiFormData.append('text_to_hl', textToHighlight);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'quotes_writings_art':
      case 'quotes_writings_morning':
      case 'quotes_writings_thonjeza':
      case 'quotes_writings_citim':
        // For Quotes & Writings templates
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add author for art and citim
        if (subText && (templateType === 'quotes_writings_art' || templateType === 'quotes_writings_citim')) {
          apiFormData.append('sub_text', subText);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'logo_only':
      case 'reforma_logo_only':
        // For Logo Only templates
        apiFormData.append('template_type', templateType);
        
        // Add logo position
        if (logoPosition) {
          apiFormData.append('pos', logoPosition);
        }
        break;

      case 'reforma_quotes_writings':
      case 'reforma_new_quote':
        // For Reforma Quotes templates
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add subtitle
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'reforma_feed_swipe':
        // For Reforma Feed Swipe template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'reforma_news_feed':
        // For Reforma News Feed template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add category
        if (subText) {
          apiFormData.append('sub_text', subText || 'LAJM');
        } else {
          apiFormData.append('sub_text', 'LAJM');
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        break;

      case 'reforma_web_news_story1':
      case 'reforma_web_news_story2':
        // For Reforma Web News Story templates
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Override crop mode for news stories
        apiFormData.append('crop_mode', 'story');
        
        // Add article URL if provided
        if (templateType === 'reforma_web_news_story2' && subText) {
          apiFormData.append('sub_text', subText);
        }
        else if (templateType === 'reforma_web_news_story1' && category) {
          apiFormData.append('category', category);
        }
        break;

      case 'reforma_web_news_story_2':
        // For Reforma Web News Story (Caption) template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add caption as sub_text
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        
        // Override crop mode for news stories
        apiFormData.append('crop_mode', 'story');
        break;

      default:
        // For any other template type
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add sub_text if provided
        if (subText) {
          apiFormData.append('sub_text', subText);
        }
        
        // Add show arrow if provided
        if (showArrow) {
          apiFormData.append('arrow', showArrow);
        }
        
        // Add category if provided
        if (category) {
          apiFormData.append('category', category);
        }
    }
  }
}