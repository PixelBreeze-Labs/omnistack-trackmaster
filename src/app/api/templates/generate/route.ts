// src/app/api/templates/generate/route.ts
import { NextResponse } from 'next/server';

// Configure paths
const PYTHON_API_URL = process.env.NEXT_PYTHON_API_URL || 'https://stageapi.pixelbreeze.xyz/generate';
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
    
    // Check if required fields are provided
    if (!articleUrl) {
      return NextResponse.json({
        status: 0,
        msg: "Article URL is required"
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
    
    // Add article URL and mark as article mode
    apiFormData.append('artical_url', articleUrl);
    apiFormData.append('IsArticle', '1');
    
    // Handle different template types
    if (templateType === 'web_news_story') {
      // For Web News Story (Story 1 or Story 2)
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
      
      // Add crop mode
      apiFormData.append('crop_mode', 'story');
    } 
    else if (templateType === 'web_news_story_2') {
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
      
      // Add crop mode
      apiFormData.append('crop_mode', 'story');
    }
    else {
      // For any other template type
      apiFormData.append('template_type', templateType);
      
      if (title) {
        apiFormData.append('text', title);
      }
    }
    
    // Log what we're sending
    console.log('Sending to Python API:', {
      template_type: templateType,
      custom_template_type: customTemplateType,
      session_id: sessionId,
      output_path: outputPath,
      article_url: articleUrl,
      title: title,
      description: description,
      category: category
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