# Elite Listing AI - API Testing Guide

## Setup

1. Add your OpenAI API key to `.env.local`:
```bash
OPENAI_API_KEY="sk-your-actual-key-here"
```

2. Restart the dev server:
```bash
npm run dev
```

## API Endpoints

### POST /api/optimize

Optimizes listing content using OpenAI GPT-4o-mini.

**Request:**
```bash
curl -X POST http://localhost:3000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "shopify",
    "title": "Vintage Leather Messenger Bag",
    "description": "Handcrafted leather messenger bag perfect for work or travel",
    "tags": ["leather", "vintage", "bag"],
    "photoScore": 78
  }'
```

**Request Schema:**
- `platform` (required): string - e.g., "shopify", "etsy", "ebay", "amazon"
- `title` (required): string - Original product title
- `description` (optional): string - Original product description
- `tags` (optional): array of strings - Current tags/keywords
- `photoScore` (optional): number (0-100) - Photo quality score (default: 75)

**Response (Success):**
```json
{
  "ok": true,
  "variant_count": 3,
  "variants": [
    {
      "title": "Premium Vintage Leather Messenger Bag - Handcrafted for Professionals",
      "description": "Discover timeless elegance with our handcrafted vintage leather messenger bag...",
      "tags": ["leather", "vintage", "messenger bag", "handcrafted", "professional", "work bag", "travel", "business", "premium", "durable", "classic", "brown leather", "laptop bag"],
      "copyScore": 92
    },
    {
      "title": "Authentic Vintage Leather Messenger Bag - Perfect for Work & Travel",
      "description": "Elevate your daily commute with this authentic vintage leather messenger bag...",
      "tags": ["vintage", "leather bag", "messenger", "authentic", "work", "travel", "professional", "handmade", "quality", "stylish", "functional", "office", "commute"],
      "copyScore": 88
    },
    {
      "title": "Handcrafted Vintage Leather Messenger Bag - Timeless Style & Durability",
      "description": "Experience the perfect blend of style and functionality...",
      "tags": ["handcrafted", "leather", "vintage style", "messenger bag", "durable", "timeless", "fashion", "accessories", "men's bag", "women's bag", "premium leather", "quality", "artisan"],
      "copyScore": 90
    }
  ],
  "healthScore": 85,
  "rationale": "Optimized for Shopify with focus on brand storytelling, emotional appeal, and SEO keywords. Each variant emphasizes different value propositions (premium quality, authenticity, craftsmanship) while maintaining strong keyword coverage for search visibility.",
  "metadata": {
    "model": "gpt-4o-mini",
    "platform": "shopify",
    "originalTitle": "Vintage Leather Messenger Bag",
    "photoScore": 78,
    "avgCopyScore": 90
  }
}
```

**Algorithm Blueprint Implementation:**
- ✅ Accepts: platform, title, description, tags, photoScore
- ✅ Validates input with Zod
- ✅ Calls OpenAI GPT-4o-mini with platform-specific prompts
- ✅ Returns 3 optimized variants
- ✅ Each variant has: title, description, 13 tags, copyScore (0-100)
- ✅ Calculates healthScore = 0.6 * avg(copyScore) + 0.4 * photoScore
- ✅ Returns rationale explaining optimization strategy

**Response (Validation Error):**
```json
{
  "ok": false,
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "path": ["platform"],
      "message": "Platform is required"
    }
  ]
}
```

**Response (OpenAI Error - No API Key):**
```json
{
  "ok": false,
  "error": "OpenAI API key not configured"
}
```

### POST /api/image/analyze

Analyzes image quality (placeholder - ready for AI vision integration).

**Request:**
```bash
curl -X POST http://localhost:3000/api/image/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/product-image.jpg"
  }'
```

**Response:**
```json
{
  "ok": true,
  "score": 82
}
```

## Testing Status

✅ **Route Structure**: Working
✅ **Zod Validation**: Working
✅ **OpenAI Integration**: Configured (needs valid API key)
✅ **Error Handling**: Working
✅ **Response Format**: Matches specification
✅ **Algorithm Blueprint**: Implemented
✅ **Health Score Calculation**: Working

## Next Steps

1. Add your OpenAI API key to `.env.local`
2. Test with real API calls
3. Implement image analysis with OpenAI Vision or similar
4. Add authentication middleware (NextAuth)
5. Connect to Prisma database for saving optimizations
6. Implement credit system with Stripe


