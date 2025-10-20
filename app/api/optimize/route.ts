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
const OptimizeRequestSchema = z.object({
  platform: z.string().min(1, 'Platform is required').default('etsy'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  photoScore: z.number().min(0).max(100).optional().default(75),
});

interface OptimizationVariant {
  title: string;
  description: string;
  tags: string[];
  copyScore: number;
}

// GET /api/optimize - Health check endpoint
export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'optimize endpoint ready',
    model: 'gpt-4o-mini',
    hasApiKey: !!process.env.OPENAI_API_KEY,
  });
}

// POST /api/optimize - Optimize listing content using OpenAI
export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  
  try {
    console.log(`[${requestId}] Processing optimization request...`);
    // Parse and validate input
    const body = await request.json();
    const validatedInput = OptimizeRequestSchema.parse(body);
    
    const { platform, title, description, tags, photoScore } = validatedInput;

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

    console.log(`[${requestId}] Input validated: platform=${platform}, title="${title.substring(0, 30)}...", photoScore=${photoScore}`);

    // Construct the AI prompt based on Algorithm Blueprint
    const systemPrompt = `You are an expert e-commerce listing optimizer specializing in ${platform} listings. 
Your goal is to create compelling, conversion-optimized product listings that drive sales.

Generate 3 distinct optimized variants of the listing. Each variant should:
1. Have a compelling, keyword-rich title (60-80 characters ideal)
2. Include a persuasive description (150-300 words) with benefits, features, and emotional appeal
3. Contain exactly 13 relevant, high-traffic tags/keywords
4. Be assigned a copyScore (0-100) based on SEO optimization, readability, and conversion potential

Consider the platform's best practices:
- Shopify: Focus on brand storytelling, benefits over features
- Etsy: Emphasize handmade/unique qualities, craftsmanship
- eBay: Highlight condition, value, detailed specifications
- Amazon: Optimize for search, use bullet points, feature-focused

Return your response as valid JSON with this exact structure:
{
  "variants": [
    {
      "title": "string",
      "description": "string",
      "tags": ["tag1", "tag2", ... 13 tags total],
      "copyScore": number
    }
  ],
  "rationale": "Brief explanation of optimization strategy"
}`;

    const userPrompt = `Original Listing:
Platform: ${platform}
Title: ${title}
Description: ${description || 'Not provided'}
Current Tags: ${tags?.join(', ') || 'None'}
Photo Quality Score: ${photoScore}/100

Generate 3 optimized variants that will maximize conversions and search visibility.`;

    // Call OpenAI API
    console.log(`[${requestId}] Calling OpenAI API with model gpt-4o-mini...`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    });
    console.log(`[${requestId}] OpenAI API call successful`);

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse AI response
    const aiResponse = JSON.parse(responseContent);
    const variants: OptimizationVariant[] = aiResponse.variants || [];
    const rationale: string = aiResponse.rationale || 'Optimizations generated based on platform best practices.';

    // Validate we have 3 variants
    if (variants.length === 0) {
      throw new Error('No variants generated');
    }

    // Ensure each variant has exactly 13 tags and a copyScore
    const normalizedVariants = variants.map((variant, index) => {
      // Ensure we have exactly 13 tags
      const variantTags = variant.tags || [];
      while (variantTags.length < 13) {
        variantTags.push(tags?.[variantTags.length % (tags?.length || 1)] || `tag${variantTags.length + 1}`);
      }
      
      return {
        title: variant.title,
        description: variant.description,
        tags: variantTags.slice(0, 13),
        copyScore: variant.copyScore || 75,
      };
    });

    // Calculate average copyScore
    const avgCopyScore = normalizedVariants.reduce((sum, v) => sum + v.copyScore, 0) / normalizedVariants.length;

    // Calculate healthScore using Algorithm Blueprint formula
    // healthScore = 0.6 * avg(copyScore) + 0.4 * photoScore
    const healthScore = Math.round(0.6 * avgCopyScore + 0.4 * photoScore);

    console.log(`[${requestId}] Optimization complete: ${normalizedVariants.length} variants, healthScore=${healthScore}`);

    // Return optimized response
    return NextResponse.json({
      ok: true,
      variant_count: normalizedVariants.length,
      variants: normalizedVariants,
      healthScore,
      rationale,
      metadata: {
        model: 'gpt-4o-mini',
        platform,
        originalTitle: title,
        photoScore,
        avgCopyScore: Math.round(avgCopyScore),
        requestId,
      },
    });

  } catch (error: any) {
    console.error(`[${requestId}] Error optimizing listing:`, error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error(`[${requestId}] Validation error:`, error.issues);
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid input parameters',
            details: error.issues,
            requestId,
          },
        },
        { status: 400 }
      );
    }

    // Handle OpenAI errors
    if (error?.status) {
      console.error(`[${requestId}] OpenAI API error (${error.status}):`, error.message);
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: error.code || 'openai_error',
            message: error.message,
            requestId,
          },
        },
        { status: error.status }
      );
    }

    // Generic error
    console.error(`[${requestId}] Unexpected error:`, error.message);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to optimize listing',
          requestId,
        },
      },
      { status: 500 }
    );
  }
}

