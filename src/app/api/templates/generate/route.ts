import { NextRequest, NextResponse } from 'next/server';
import { getFormValidationRules, validateForm, getArticleValidationRules } from '@/utils/formValidation';
import { processTemplate } from './service';  // Import from local file

export async function POST(request: NextRequest) {
  try {
    // Record start time
    const startTime = Date.now();
    
    // Parse the FormData
    const formData = await request.formData();
    
    // Get template type
    const templateType = formData.get('template_type') as string;
    if (!templateType) {
      return NextResponse.json({
        status: 0,
        msg: "Template type is required"
      }, { status: 400 });
    }

    // Determine if this is an article-based template
    const isArticle = (
      (templateType === 'web_news_story' || 
       templateType === 'web_news_story_2' || 
       templateType === 'web_news') && 
      formData.get('artical_url')
    );

    // Get appropriate validation rules
    const validationRules = isArticle 
      ? getArticleValidationRules() 
      : getFormValidationRules(templateType);

    // Create validation data object from form data
    const validationData: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      // Skip file entries for validation purposes
      if (typeof value === 'object' && value !== null && typeof value.name === 'string') {
        validationData[key] = value;
      } else {
        validationData[key] = value;
      }
    }

    // Validate the form data
    const { isValid, errors } = validateForm(validationData, validationRules);
    
    if (!isValid) {
      return NextResponse.json({
        status: 0,
        msg: errors.join('<br />')
      }, { status: 400 });
    }

    // Process the template - now as a function call instead of a class
    const result = await processTemplate(formData);
    
    // Calculate processing time
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    // Add timing information to the response
    const responseWithTiming = {
      ...result,
      processingTime,
      processingTimeFormatted: `${(processingTime / 1000).toFixed(2)}s`
    };
    
    return NextResponse.json(responseWithTiming, { 
      status: result.status === 1 ? 200 : 400 
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json({
      status: 0,
      msg: error instanceof Error ? error.message : "An error occurred while processing your request"
    }, { status: 500 });
  }
}