// app/api/templates/spellcheck-v2/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This version uses a different spellcheck API as an alternative to OpenAI
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({
        status: 0,
        msg: "Invalid text input"
      }, { status: 400 });
    }
    
    // For this example, we'll use a free API service for spell checking
    // In production, you might want to use a more reliable service with an API key
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'text': text,
          'language': 'auto',
          'enabledOnly': 'false'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the API response to get corrected text
      let correctedText = text;
      let offset = 0;
      
      // Sort matches by position to apply corrections from end to beginning
      // This prevents offsets from shifting as we make replacements
      if (data.matches) {
        const sortedMatches = [...data.matches].sort((a, b) => b.offset - a.offset);
        
        for (const match of sortedMatches) {
          // Only apply corrections if there are replacements suggested
          if (match.replacements && match.replacements.length > 0) {
            const replacement = match.replacements[0].value;
            
            // Replace the error with the suggested correction
            correctedText = 
              correctedText.substring(0, match.offset) + 
              replacement + 
              correctedText.substring(match.offset + match.length);
          }
        }
      }
      
      return NextResponse.json({
        status: 1,
        suggestion: correctedText
      });
    } catch (apiError) {
      console.error('Language Tool API error:', apiError);
      
      // Fallback: return a simple correction (capitalize first letter)
      const suggestion = text.charAt(0).toUpperCase() + text.slice(1);
      
      return NextResponse.json({
        status: 1,
        suggestion,
        note: "Used fallback correction due to API error"
      });
    }
  } catch (error) {
    console.error('Spellcheck-v2 error:', error);
    
    return NextResponse.json({
      status: 0,
      msg: "An error occurred while processing your request"
    }, { status: 500 });
  }
}