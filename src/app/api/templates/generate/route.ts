// src/app/api/templates/generate/route.ts
import { NextResponse } from 'next/server';

// Configure paths
const PYTHON_API_URL = process.env.NEXT_PYTHON_API_URL || 'https://stageapi.pixelbreeze.xyz/generate';
const PHP_UPLOAD_URL = process.env.PHP_UPLOAD_URL || 'https://stageadmin.pixelbreeze.xyz/upload-file';
const STORAGE_DOMAIN = 'https://stageadmin.pixelbreeze.xyz';
const OUTPUT_DIR = '/var/www/html/stageadmin.pixelbreeze.xyz/storage/app/public/uploads';

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Extract data
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
    
    // Check article URL requirement only for news templates
    if ((templateType === 'web_news_story' || templateType === 'web_news_story_2') && !articleUrl) {
      return NextResponse.json({
        status: 0,
        msg: "Article URL is required for news templates"
      }, { status: 400 });
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
    
    // Handle file upload if provided
    let fileUploadPath = '';
    if (file && file.size > 0) {
      try {
        // Create file upload form data
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        
        // Upload file to PHP endpoint
        const uploadResponse = await fetch(PHP_UPLOAD_URL, {
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
        console.error('File upload error:', uploadError);
        return NextResponse.json({
          status: 0,
          msg: "Failed to upload file"
        }, { status: 500 });
      }
    }
    
    // Add article URL if provided
    if (articleUrl) {
      apiFormData.append('artical_url', articleUrl);
      apiFormData.append('IsArticle', '1');
    }
    
    // Add crop mode if provided
    if (cropMode) {
      apiFormData.append('crop_mode', cropMode);
    }
    
    // Handle different template types
    switch (templateType) {
      case 'web_news_story':
        // For Web News Story
        if (customTemplateType) {
          apiFormData.append('template_type', customTemplateType);
        } else {
          apiFormData.append('template_type', 'web_news_story');
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
        
      case 'feeds_iconic':
        // For Feeds Iconic template
        apiFormData.append('template_type', templateType);
        
        // Add title
        if (title) {
          apiFormData.append('text', title);
        }
        
        // Add category
        if (category) {
          apiFormData.append('category', category);
        }
        break;
        
      default:
        // For any other template type
        apiFormData.append('template_type', templateType);
        
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
    
    // Log what we're sending
    console.log('Sending to Python API:', {
      template_type: templateType,
      custom_template_type: customTemplateType,
      session_id: sessionId,
      output_path: outputPath,
      input_path: fileUploadPath,
      article_url: articleUrl,
      title: title,
      description: description,
      category: category,
      sub_text: subText,
      crop_mode: cropMode,
      show_arrow: showArrow,
      location: location
    });
    
    // Call the Python API
    const response = await fetch(PYTHON_API_URL, {
      method: 'POST',
      body: apiFormData,
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python API error:', errorText);
      
      return NextResponse.json({
        status: 0,
        msg: `Image generation failed: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }
    
    // Process successful response
    const result = await response.json();
    console.log('API response:', result);
    
    // Construct URL to the generated image
    const imageUrl = `${STORAGE_DOMAIN}/storage/uploads/${outputImageName}`;
    
    return NextResponse.json({
      status: 1,
      msg: "Image generated successfully",
      img: imageUrl
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    
    return NextResponse.json({
      status: 0,
      msg: "An error occurred while processing your request"
    }, { status: 500 });
  }
}