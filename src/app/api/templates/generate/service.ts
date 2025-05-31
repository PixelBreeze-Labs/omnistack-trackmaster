// src/app/api/templates/generate/service.ts

export type TemplateResponse = {
  status: number;
  msg?: string;
  img?: string;
};

// ADDED: Helper function for delays
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// ADDED: Check if error is retryable
const isRetryableError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  const errorCode = error.code || '';
  
  // Network-related errors that are retryable
  const retryablePatterns = [
    /ECONNRESET/i,
    /ENOTFOUND/i,
    /ECONNREFUSED/i,
    /ETIMEDOUT/i,
    /timeout/i,
    /network/i,
    /connection/i,
    /temporarily unavailable/i,
    /service unavailable/i,
    /502/i,
    /503/i,
    /504/i
  ];
  
  return retryablePatterns.some(pattern => 
    pattern.test(errorMessage) || pattern.test(errorCode)
  );
};

// ADDED: Parse and clean error messages for users
const parseErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  const errorMessage = error.message || error.toString();
  
  // Extract JSON error from Python API response
  try {
    const jsonMatch = errorMessage.match(/\{.*\}/);
    if (jsonMatch) {
      const parsedError = JSON.parse(jsonMatch[0]);
      if (parsedError.error) {
        const pythonError = parsedError.error;
        
        // Handle specific error types with user-friendly messages
        if (pythonError.includes('cannot identify image file')) {
          if (pythonError.includes('.pdf')) {
            return 'Please upload an image file (JPG, PNG, etc.) instead of a PDF document.';
          }
          return 'The uploaded file is not a valid image. Please upload a JPG, PNG, or other image format.';
        }
        
        if (pythonError.includes('No such file or directory')) {
          return 'The uploaded file could not be found. Please try uploading again.';
        }
        
        if (pythonError.includes('permission denied')) {
          return 'File access error. Please try again or contact support.';
        }
        
        if (pythonError.includes('file too large') || pythonError.includes('size limit')) {
          return 'The uploaded file is too large. Please use a smaller image.';
        }
        
        if (pythonError.includes('invalid url') || pythonError.includes('url not found')) {
          return 'The article URL could not be accessed. Please check the URL and try again.';
        }
        
        // Return the Python error message if it's already user-friendly
        if (pythonError.length < 100 && !pythonError.includes('/var/www') && !pythonError.includes('http')) {
          return pythonError;
        }
      }
    }
  } catch (parseError) {
    // Continue to fallback handling
  }
  
  // Handle HTTP status errors
  if (errorMessage.includes('500 Internal Server Error')) {
    return 'The image generation service is temporarily unavailable. Please try again.';
  }
  
  if (errorMessage.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (errorMessage.includes('404')) {
    return 'The requested service is not available. Please try again later.';
  }
  
  // Handle network errors
  if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
    return 'The request timed out. Please try again.';
  }
  
  if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
    return 'Connection error. Please check your internet connection and try again.';
  }
  
  // Fallback for any other error
  return 'Image generation failed. Please try again or contact support if the problem persists.';
};

// ADDED: File upload with retry
async function uploadFileWithRetry(file: any, uploadUrl: string): Promise<string> {
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [1000, 2000, 3000]; // 1s, 2s, 3s
  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        const delayTime = RETRY_DELAYS[attempt - 2] || 3000;
        console.warn(`File upload retry ${attempt - 1}/${MAX_RETRIES - 1}, waiting ${delayTime}ms...`);
        await delay(delayTime);
      }

      const fileFormData = new FormData();
      fileFormData.append('file', file);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: fileFormData,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.status !== 1) {
        throw new Error(uploadResult.message || 'File upload failed');
      }
      
      return uploadResult.file_path;
      
    } catch (error) {
      lastError = error;
      console[attempt < MAX_RETRIES ? 'warn' : 'error'](
        `File upload attempt ${attempt}/${MAX_RETRIES} failed:`, 
        error
      );
      
      // If this is the last attempt or error is not retryable, break
      if (attempt === MAX_RETRIES || !isRetryableError(error)) {
        break;
      }
    }
  }
  
  throw lastError || new Error('File upload failed. Please try again.');
}

// ADDED: Python API call with retry
async function callPythonApiWithRetry(apiUrl: string, formData: FormData): Promise<any> {
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [2000, 4000, 6000]; // 2s, 4s, 6s
  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        const delayTime = RETRY_DELAYS[attempt - 2] || 6000;
        console.warn(`Python API retry ${attempt - 1}/${MAX_RETRIES - 1}, waiting ${delayTime}ms...`);
        await delay(delayTime);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Python API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      lastError = error;
      console[attempt < MAX_RETRIES ? 'warn' : 'error'](
        `Python API attempt ${attempt}/${MAX_RETRIES} failed:`, 
        error
      );
      
      // If this is the last attempt or error is not retryable, break
      if (attempt === MAX_RETRIES || !isRetryableError(error)) {
        break;
      }
    }
  }
  
  throw lastError || new Error('Image generation service is temporarily unavailable. Please try again.');
}

/**
 * Process a template submission
 */
export async function processTemplate(formData: FormData): Promise<TemplateResponse> {
  const API_URL = process.env.NEXT_PYTHON_API_URL || 'https://stageapi.pixelbreeze.xyz/generate';
  const PHP_UPLOAD_URL = process.env.PHP_UPLOAD_URL || 'https://stageadmin.pixelbreeze.xyz/upload-file';
  const STORAGE_DOMAIN = 'https://stageadmin.pixelbreeze.xyz';
  const OUTPUT_DIR = '/var/www/html/stageadmin.pixelbreeze.xyz/storage/app/public/uploads';

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
    const file = formData.get('image') as any;
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
    const outputPath = `${OUTPUT_DIR}/${outputImageName}`;
    apiFormData.append('output_img_path', outputPath);
    
    // UPDATED: Handle file upload with retry
    let fileUploadPath = '';
    if (file && file.size > 0) {
      try {
        fileUploadPath = await uploadFileWithRetry(file, PHP_UPLOAD_URL);
        apiFormData.append('input_img_path', fileUploadPath);
      } catch (uploadError) {
        console.error('File upload failed after all retries:', uploadError);
        return {
          status: 0,
          msg: parseErrorMessage(uploadError)
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
    prepareTemplateSpecificData(
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
    
    // UPDATED: Call the Python API with retry
    try {
      const result = await callPythonApiWithRetry(API_URL, apiFormData);
      
      // Construct URL to the generated image
      const imageUrl = `${STORAGE_DOMAIN}/storage/uploads/${outputImageName}`;
      
      return {
        status: 1,
        msg: "Image generated successfully",
        img: imageUrl
      };
      
    } catch (apiError) {
      console.error('Python API call failed after all retries:', apiError);
      return {
        status: 0,
        msg: parseErrorMessage(apiError)
      };
    }
    
  } catch (error) {
    console.error('Template processing error:', error);
    
    return {
      status: 0,
      msg: parseErrorMessage(error)
    };
  }
}

/**
 * Prepare template-specific data for the API request
 */
export function prepareTemplateSpecificData(
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
        // For IconStyle Logo Only template
        apiFormData.append('template_type', templateType);
        
        // Add logo position with the parameter name logo_position
        if (logoPosition) {
          apiFormData.append('logo_position', logoPosition);
        }
        break;
      
      case 'reforma_logo_only':
        // For Reforma Logo Only template
        apiFormData.append('template_type', templateType);
        
        // Add logo position with the parameter name pos
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