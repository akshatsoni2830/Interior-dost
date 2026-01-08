# Interior-Dost

AI-powered room redesign application specifically tailored for Indian homes.

## Overview

Interior-Dost is a hackathon MVP that accepts a single room image, analyzes it using vision AI, generates a redesigned version using SDXL + ControlNet, and suggests shoppable furniture categories. The core innovation is the Prompt Optimizer that converts simple user input into high-quality, context-aware AI prompts suitable for Indian home aesthetics.

## Features

- 🖼️ Single room image upload (jpg/png)
- 🤖 AI-powered room analysis (Gemini Vision or GPT-4 Vision)
- ✨ Intelligent prompt optimization for Indian home aesthetics
- 🎨 Image generation using Replicate SDXL + ControlNet
- 🛋️ Furniture category suggestions with shopping links
- 🔄 Fallback modes for demo reliability

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Vision AI**: Google Gemini Vision API or OpenAI GPT-4 Vision API
- **Image Generation**: Replicate API (SDXL + ControlNet)
- **Testing**: Jest, React Testing Library, fast-check (property-based testing)

## Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- API keys for:
  - Replicate API
  - Google Gemini Vision API OR OpenAI API

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

4. Edit `.env` and add your API keys:
```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
GEMINI_API_KEY=your_gemini_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here

VISION_PROVIDER=gemini  # or openai
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Flow

1. **Upload Image**: Select a room image (jpg or png, max 10MB)
2. **Choose Style**: Enter custom text or select a vibe preset (modern, traditional, minimalist, bohemian)
3. **Generate**: Click "Redesign" to start the AI pipeline
4. **View Results**: See before/after comparison, room analysis, and furniture suggestions
5. **Shop**: Click furniture categories to search on Amazon, Flipkart, or Pepperfry

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
- **API Dependencies**: Requires active Replicate and Vision AI API keys
- **No Persistence**: No database - all data is session-based
- **No Authentication**: No user accounts or saved designs
- **Processing Time**: Image generation can take 30-60 seconds
- **Rate Limits**: Subject to API provider rate limits and costs
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

- **Replicate SDXL**: ~$0.01-0.03 per image
- **Gemini Vision**: Free tier available, then ~$0.001 per image
- **GPT-4 Vision**: ~$0.01 per image

Budget accordingly for demo usage.

## Contributing

This is a hackathon MVP. Contributions welcome but keep the scope focused on reliability and demo-readiness.

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Indian homes
