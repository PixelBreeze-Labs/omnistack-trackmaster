// src/app/api/templates/generate/route.ts
import { NextResponse } from 'next/server';

// This will be replaced with your actual Python API integration
const PYTHON_API_URL = process.env.NEXT_PYTHON_API_URL || 'http://your-python-api.com/generate';

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const templateType = formData.get('template_type') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const articleUrl = formData.get('artical_url') as string;
    const imageFile = formData.get('image') as File;

    // Log submission for analytics
    console.log('Form submission start', {
      step: 'submission_start',
      template_type: templateType,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    if (!title) {
      return NextResponse.json({
        status: 0,
        msg: "Title is required"
      }, { status: 400 });
    }

    // For templates that require either URL or image
    if (['web_news_story', 'web_news_story_2'].includes(templateType)) {
      if (!articleUrl && !imageFile) {
        return NextResponse.json({
          status: 0,
          msg: "Please provide either an Article URL or upload a file"
        }, { status: 400 });
      }
    }

    // Prepare data to send to Python API
    const apiFormData = new FormData();
    apiFormData.append('template_type', templateType);
    apiFormData.append('title', title);
    
    if (category) {
      apiFormData.append('category', category);
    }
    
    if (articleUrl) {
      apiFormData.append('artical_url', articleUrl);
    }
    
    if (imageFile) {
      apiFormData.append('image', imageFile);
    }

    let generatedImageUrl;

    // OPTION 1: For development/testing without Python API
    // This simulates the image generation by returning a placeholder image
    if (process.env.NODE_ENV === 'development') {
      // Simulate a delay to mimic API processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return a placeholder image based on template type
      const placeholders = {
        'web_news_story': '/images/templates/web_news_story_generated.jpg',
        'web_news_story_2': '/images/templates/web_news_story_2_generated.jpg',
        // Add more placeholders as needed
      };
      
      generatedImageUrl = placeholders[templateType] || '/images/templates/default_generated.jpg';
    } 
    // OPTION 2: For production with actual Python API
    else {
      try {
        // Call the Python API
        const response = await fetch(PYTHON_API_URL, {
          method: 'POST',
          body: apiFormData,
        });
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        
        // Check if the API returned a successful response
        if (data.status !== 1) {
          return NextResponse.json({
            status: 0,
            msg: data.msg || "Image generation failed"
          }, { status: 400 });
        }
        
        generatedImageUrl = data.img;
      } catch (error) {
        console.error('Python API error:', error);
        return NextResponse.json({
          status: 0,
          msg: "Failed to connect to image generation service"
        }, { status: 500 });
      }
    }

    // Log success
    console.log('Generation successful', {
      step: 'success',
      image: generatedImageUrl,
      timestamp: new Date().toISOString()
    });

    // Return the generated image URL
    return NextResponse.json({
      status: 1,
      msg: "Image generated successfully",
      img: generatedImageUrl
    });

  } catch (error) {
    console.error('Generation error:', error);
    
    // Log error
    console.error('API error', {
      type: 'server_error',
      error,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      status: 0,
      msg: "An error occurred while processing your request"
    }, { status: 500 });
  }
}