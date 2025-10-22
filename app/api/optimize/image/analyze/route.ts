import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Input validation schema
const AnalyzeImageRequestSchema = z.object({
  imageUrl: z.string().url('Image URL must be a valid URL'),
  platform: z.string().min(1, 'Platform is required').default('etsy'),
});

// GET /api/image/analyze - Health check endpoint
export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'image analysis endpoint ready',
    model: 'gpt-4o',
    hasApiKey: !!process.env.OPENAI_API_KEY,
  });
}

// POST /api/image/analyze - Analyze product image quality
export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  try {
    console.log(`[${requestId}] Processing image analysis request...`);

    // Parse and validate input
    const body = await request.json();
    const validatedInput = AnalyzeImageRequestSchema.parse(body);
    const { imageUrl, platform } = validatedInput;

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error(`[${requestId}] OpenAI API key not configured`);
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'missing_api_key',
            message: 'OpenAI API key not configured',
            requestId,
          },
        },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] Input validated: platform=${platform}, imageUrl=${imageUrl.substring(0, 50)}...`);

    const systemPrompt = `You are an expert e-commerce product photography analyst specializing in ${platform} listings. 
Analyze product images and provide detailed quality scores and actionable feedback.

Evaluate images across these dimensions:
- Lighting (0-100): Quality of illumination, shadows, natural vs artificial light
- Composition (0-100): Framing, centering, angles, professional appearance  
- Clarity (0-100): Sharpness, focus, resolution, image quality
- Appeal (0-100): Visual attractiveness, product showcase, buyer engagement

Provide scores, detailed feedback, and 3-5 specific improvement suggestions.`;

    const userPrompt = `Analyze this ${platform} product image: ${imageUrl}

Provide your analysis in this exact JSON format:
{
  "lighting": <number 0-100>,
  "composition": <number 0-100>,
  "clarity": <number 0-100>,
  "appeal": <number 0-100>,
  "feedback": "<detailed explanation of scores>",
  "suggestions": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}`;

    // Call OpenAI Vision API
    console.log(`[${requestId}] Calling OpenAI Vision API with model gpt-4o...`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    });

    console.log(`[${requestId}] OpenAI Vision API call successful`);

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse AI response
    const aiResponse = JSON.parse(responseContent);
    
    // Calculate overall score
    const overallScore = Math.round(
      (aiResponse.lighting + aiResponse.composition + aiResponse.clarity + aiResponse.appeal) / 4
    );

    console.log(`[${requestId}] Image analysis complete. Overall score: ${overallScore}/100`);

    return NextResponse.json({
      ok: true,
      score: overallScore,
      lighting: aiResponse.lighting,
      composition: aiResponse.composition,
      clarity: aiResponse.clarity,
      appeal: aiResponse.appeal,
      feedback: aiResponse.feedback,
      suggestions: aiResponse.suggestions || [],
      requestId,
    });

  } catch (error: any) {
    console.error(`[${requestId}] Error analyzing image:`, error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid request data',
            details: error.errors,
            requestId,
          },
        },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error?.status) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'openai_error',
            message: error.message || 'OpenAI API error',
            requestId,
          },
        },
        { status: error.status }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'internal_error',
          message: error.message || 'Internal server error',
          requestId,
        },
      },
      { status: 500 }
    );
  }
}
