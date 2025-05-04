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
    const title = formData.get('title') as string | null;
    const category = formData.get('category') as string | null;
    const articleUrl = formData.get('artical_url') as string | null;
    const imageFile = formData.get('image') as File | null;
    
    // Check if image was uploaded but no URL provided
    if (imageFile && !articleUrl) {
      return NextResponse.json({
        status: 0,
        msg: "Image uploads are not supported in this version. Please use an Article URL instead."
      }, { status: 400 });
    }
    
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
    
    // Add template type and output path
    apiFormData.append('template_type', templateType);
    apiFormData.append('output_img_path', outputPath);
    
    // Add article URL and mark as article mode
    apiFormData.append('artical_url', articleUrl);
    apiFormData.append('IsArticle', '1');
    
    // Add title if provided
    if (title) {
      apiFormData.append('text', title);
    }
    
    // Add category if provided
    if (category) {
      apiFormData.append('category', category);
    }
    
    // Add crop mode for story templates
    if (['web_news_story', 'web_news_story_2'].includes(templateType)) {
      apiFormData.append('crop_mode', 'story');
    }
    
    // Log what we're sending
    console.log('Sending to Python API:', {
      template_type: templateType,
      session_id: sessionId,
      output_path: outputPath,
      article_url: articleUrl
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