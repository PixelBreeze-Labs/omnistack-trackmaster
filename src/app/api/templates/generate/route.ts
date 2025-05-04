// src/app/api/templates/generate/route.ts
import { NextResponse } from 'next/server';

// Configure the correct domain and paths
const PYTHON_API_URL = process.env.NEXT_PYTHON_API_URL || 'https://stageapi.pixelbreeze.xyz/generate';
const STORAGE_DOMAIN = 'https://stageadmin.pixelbreeze.xyz';
const STORAGE_PATH = '/var/www/html/stageadmin.pixelbreeze.xyz/storage/app/public/uploads/';

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
    
    // Validation for URL-only case
    // If article URL is provided, we don't require title or image
    if (!articleUrl && !title) {
      return NextResponse.json({
        status: 0,
        msg: "Either Article URL or Title is required"
      }, { status: 400 });
    }
    
    // Create a new FormData for Python API
    const apiFormData = new FormData();
    
    // Session ID
    const sessionId = 'session_' + Date.now();
    apiFormData.append('session_id', sessionId);
    
    // Generate output filename
    const timestamp = Date.now();
    const outputImageName = `output_${timestamp}.jpg`;
    const outputPath = STORAGE_PATH + outputImageName;
    
    // Add output path to API form data
    apiFormData.append('output_img_path', outputPath);
    
    // Add template type
    apiFormData.append('template_type', templateType);
    
    // Check if we're dealing with URL-only case
    const isArticleUrl = !!articleUrl;
    
    // If it's an article URL case, mark it
    if (isArticleUrl) {
      apiFormData.append('artical_url', articleUrl);
      // For article URL case, add IsArticle=1 flag like in PHP version
      apiFormData.append('IsArticle', '1');
    }
    
    // Only add title if provided
    if (title) {
      apiFormData.append('text', title);
    }
    
    // Only add category if provided
    if (category) {
      apiFormData.append('category', category);
    }
    
    // Only add image if provided and we're not using article URL
    if (imageFile && !isArticleUrl) {
      apiFormData.append('image', imageFile);
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
      is_article_url: isArticleUrl,
      has_title: !!title,
      has_category: !!category,
      has_image: !!imageFile
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
    
    // Return success response
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