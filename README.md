# Interior-Dost v2.9

AI-powered room redesign application with **SDXL Turbo** - fast, free, and excellent image-to-image support.

## Overview

Interior-Dost is a production-ready MVP that accepts a single room image, analyzes it using vision AI, generates a redesigned version using **SDXL Turbo**, and suggests shoppable furniture categories. The core innovation is simplified, reliable image generation with strong geometry preservation for consistent, high-quality results.

## Features

- 🖼️ Single room image upload (jpg/png) or camera capture
- 🤖 AI-powered room analysis (Gemini Vision or GPT-4 Vision)
- ✨ Detailed professional prompts ("Act as interior designer")
- 🎨 **SDXL Turbo image generation** - Fast, free, and excellent image-to-image support!
- 🔒 **Perfect geometry preservation** via image-to-image transformation
- 🏠 **Realistic details**: AC units, wiring, artwork, lighting fixtures
- 🛋️ Furniture category suggestions with shopping links
- 📱 Mobile camera support for instant photo capture
- 🎨 Premium interior design UI with warm neutral palette
- 🔄 Fallback modes for demo reliability
- ✍️ Personal prompt enhancement - write your own custom prompts

## What's New in v2.9

### 🎯 Switched to SDXL Turbo for Better Geometry Preservation!

**Focus on image-to-image quality** - we've switched to SDXL Turbo which has superior image-to-image support:

- **SDXL Turbo as Primary Model** - Excellent image-to-image transformation!
- **Better Geometry Preservation** - Maintains room structure more accurately
- **90-Second Generation** - Quick results without compromising quality
- **100% Free** - No API costs for image generation
- **Proven Quality** - SDXL Turbo delivers consistent, professional results with better geometry lock

**Result:** Your room's windows, walls, and layout stay in place while furniture and decor are added! ✨

See [WHATS-NEW.md](./WHATS-NEW.md) for complete details.

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Vision AI**: Google Gemini Vision API or OpenAI GPT-4 Vision API
- **Image Generation**: Pollinations.ai with SDXL Turbo (Fast, free, excellent image-to-image!)
- **Testing**: Jest, React Testing Library, fast-check (property-based testing)

## Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- API key for Google Gemini Vision API (FREE tier available)
  - Get your key at: https://aistudio.google.com/app/apikey
- OR OpenAI API key (paid alternative for vision)

**Note**: SDXL Turbo is completely free - no API key needed for image generation!

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interior-dost
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Gemini API key:
```env
# Vision AI (required)
GEMINI_API_KEY=your_gemini_api_key_here
VISION_PROVIDER=gemini

# Image Generation (no API key needed!)
# Pollinations.ai SDXL Turbo is used automatically - 100% FREE!

# Optional: Demo Mode
DEMO_MODE=false
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Flow

1. **Upload or Capture Image**: Select a room image (jpg or png, max 10MB) or take a photo with your mobile camera
2. **Choose Style**: Enter custom text or select a vibe preset (modern, traditional, minimalist, bohemian)
3. **Generate**: Click "Redesign My Room" to start the AI pipeline
4. **View Results**: See before/after comparison with geometry-preserved redesign, room analysis, and furniture suggestions
5. **Shop**: Click furniture categories to search on Amazon, Flipkart, or Pepperfry

## What's New in v2.1

### Critical Corrections & Polish

- ✅ **Image Generation**: Pollinations.ai SDXL Turbo as PRIMARY generator (FREE, no API key)
- ✅ **Geometry Lock**: Room structure preservation with explicit constraints
- ✅ **Camera Capture**: Real mobile camera support (not just claimed)
- ✅ **Premium UI**: Warm neutral color palette for interior design aesthetic
- ✅ **Verified Navigation**: Clean landing → design flow
- ✅ **Clear Config**: Simplified environment setup

See [WHATS-NEW.md](./WHATS-NEW.md) for full details.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Known Limitations

- **Single Image Only**: Generates one redesigned image per request (no variations)
- **Vision API Dependency**: Requires active Gemini or OpenAI API key for room analysis
- **No Persistence**: No database - all data is session-based
- **No Authentication**: No user accounts or saved designs
- **Image Generation**: Uses Pollinations.ai SDXL Turbo (100% FREE, unlimited)
- **Processing Time**: Image generation typically takes 60-90 seconds
- **Rate Limits**: Subject to API provider rate limits (vision only - image generation is free)
- **Indian Context**: Optimized specifically for Indian home aesthetics

## Project Structure

```
interior-dost/
├── app/                    # Next.js app router pages and API routes
├── components/             # React components
├── services/               # External API integrations
├── lib/                    # Utility functions and core logic
├── types/                  # TypeScript type definitions
├── __tests__/              # Test files
├── public/                 # Static assets
└── .env.example            # Environment variable template
```

## API Costs (Approximate)

- **SDXL Turbo Image Generation**: 100% FREE (no API key needed)
- **Gemini Vision**: Free tier available, then ~$0.001 per image
- **GPT-4 Vision**: ~$0.01 per image

Budget accordingly for vision API usage. Image generation is completely free!

## Contributing

This is a hackathon MVP. Contributions welcome but keep the scope focused on reliability and demo-readiness.

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Indian homes
