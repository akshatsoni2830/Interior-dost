/**
 * Vision Service - Room Analysis and Furniture Detection
 * 
 * This service wraps Vision AI API calls (Gemini or GPT-4 Vision) for:
 * 1. Room analysis - extracting structured context from room images
 * 2. Furniture detection - identifying furniture categories in generated images
 * 
 * Features:
 * - API selection based on environment variable (VISION_PROVIDER)
 * - 30-second timeout for all requests
 * - Retry logic (max 2 attempts)
 * - Fallback Room_Context for API failures
 * - Comprehensive error handling and logging
 * 
 * Requirements: 2.1, 2.2, 2.3, 6.1, 9.1, 9.3, 9.4
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { RoomContext, FurnitureCategory } from '@/types';

// ============================================================================
// Configuration
// ============================================================================

const VISION_PROVIDER = process.env.VISION_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 2;

// Fallback Room Context for API failures (Requirement 9.1)
const FALLBACK_ROOM_CONTEXT: RoomContext = {
  room_type: 'living room',
  visible_objects: ['furniture', 'walls', 'floor'],
  wall_color: 'neutral',
  lighting_type: 'ambient'
};

// ============================================================================
// API Client Initialization
// ============================================================================

let geminiClient: GoogleGenerativeAI | null = null;
let openaiClient: OpenAI | null = null;

/**
 * Initialize the appropriate Vision AI client based on provider
 */
function initializeClients() {
  if (VISION_PROVIDER === 'gemini' && GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  } else if (VISION_PROVIDER === 'openai' && OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
}

// Initialize clients on module load
initializeClients();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a promise that rejects after a timeout
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

/**
 * Execute a promise with timeout (Requirement 9.3)
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([promise, createTimeoutPromise(timeoutMs)]);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Vision API Implementations
// ============================================================================

/**
 * Analyze room using Gemini Vision API
 */
async function analyzeRoomWithGemini(imageBase64: string): Promise<RoomContext> {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized. Check GEMINI_API_KEY.');
  }

  const model = geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Analyze this room image and return a JSON object with the following structure:
{
  "room_type": "string (e.g., living room, bedroom, kitchen)",
  "visible_objects": ["array", "of", "visible", "furniture", "and", "objects"],
  "wall_color": "string (e.g., white, beige, light blue)",
  "lighting_type": "string (e.g., natural, warm artificial, bright)"
}

Return ONLY the JSON object, no additional text.`;

  const imagePart = {
    inlineData: {
      data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      mimeType: 'image/jpeg'
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }

  const roomContext = JSON.parse(jsonMatch[0]) as RoomContext;
  return roomContext;
}

/**
 * Analyze room using OpenAI GPT-4 Vision API
 */
async function analyzeRoomWithOpenAI(imageBase64: string): Promise<RoomContext> {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Check OPENAI_API_KEY.');
  }

  const prompt = `Analyze this room image and return a JSON object with the following structure:
{
  "room_type": "string (e.g., living room, bedroom, kitchen)",
  "visible_objects": ["array", "of", "visible", "furniture", "and", "objects"],
  "wall_color": "string (e.g., white, beige, light blue)",
  "lighting_type": "string (e.g., natural, warm artificial, bright)"
}

Return ONLY the JSON object, no additional text.`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64.startsWith('data:') 
                ? imageBase64 
                : `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    max_tokens: 500
  });

  const text = response.choices[0]?.message?.content || '';
  
  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from OpenAI response');
  }

  const roomContext = JSON.parse(jsonMatch[0]) as RoomContext;
  return roomContext;
}

/**
 * Detect furniture using Gemini Vision API
 */
async function detectFurnitureWithGemini(imageBase64: string): Promise<string[]> {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized. Check GEMINI_API_KEY.');
  }

  const model = geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Analyze this interior design image and identify 3 to 6 furniture categories that are visible or prominent.
Return a JSON array of category names (strings) like: ["Sofa", "Coffee Table", "Rug", "Lighting", "Curtains"]

Return ONLY the JSON array, no additional text.`;

  const imagePart = {
    inlineData: {
      data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      mimeType: 'image/jpeg'
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  // Parse JSON response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON array from Gemini response');
  }

  const categories = JSON.parse(jsonMatch[0]) as string[];
  return categories;
}

/**
 * Detect furniture using OpenAI GPT-4 Vision API
 */
async function detectFurnitureWithOpenAI(imageBase64: string): Promise<string[]> {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Check OPENAI_API_KEY.');
  }

  const prompt = `Analyze this interior design image and identify 3 to 6 furniture categories that are visible or prominent.
Return a JSON array of category names (strings) like: ["Sofa", "Coffee Table", "Rug", "Lighting", "Curtains"]

Return ONLY the JSON array, no additional text.`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64.startsWith('data:') 
                ? imageBase64 
                : `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    max_tokens: 200
  });

  const text = response.choices[0]?.message?.content || '';
  
  // Parse JSON response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON array from OpenAI response');
  }

  const categories = JSON.parse(jsonMatch[0]) as string[];
  return categories;
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Analyze a room image and return structured context
 * 
 * Features:
 * - 30-second timeout (Requirement 9.3)
 * - Retry logic with 2-second delay (max 2 attempts)
 * - Fallback to default Room_Context on failure (Requirement 9.1)
 * - Error logging (Requirement 9.4)
 * 
 * @param imageBase64 - Base64 encoded image string
 * @returns Promise<RoomContext> - Structured room analysis
 * 
 * Requirements: 2.1, 2.2, 2.3, 9.1, 9.3, 9.4
 */
export async function analyzeRoom(imageBase64: string): Promise<RoomContext> {
  let lastError: Error | null = null;

  // Retry loop (max 2 attempts)
  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`[VisionService] Analyzing room (attempt ${attempt}/${MAX_RETRY_ATTEMPTS})...`);

      let analysisPromise: Promise<RoomContext>;

      if (VISION_PROVIDER === 'gemini') {
        analysisPromise = analyzeRoomWithGemini(imageBase64);
      } else if (VISION_PROVIDER === 'openai') {
        analysisPromise = analyzeRoomWithOpenAI(imageBase64);
      } else {
        throw new Error(`Unknown vision provider: ${VISION_PROVIDER}`);
      }

      // Execute with timeout (Requirement 9.3)
      const roomContext = await withTimeout(analysisPromise, REQUEST_TIMEOUT_MS);

      console.log('[VisionService] Room analysis successful:', roomContext);
      return roomContext;

    } catch (error) {
      lastError = error as Error;
      console.error(`[VisionService] Room analysis failed (attempt ${attempt}/${MAX_RETRY_ATTEMPTS}):`, error);

      // If not the last attempt, wait before retrying
      if (attempt < MAX_RETRY_ATTEMPTS) {
        console.log('[VisionService] Retrying in 2 seconds...');
        await sleep(2000);
      }
    }
  }

  // All attempts failed - use fallback (Requirement 9.1)
  console.warn('[VisionService] All attempts failed. Using fallback Room_Context.');
  console.error('[VisionService] Final error:', lastError);
  
  return FALLBACK_ROOM_CONTEXT;
}

/**
 * Detect furniture categories from a generated room image
 * 
 * Features:
 * - 30-second timeout (Requirement 9.3)
 * - Retry logic with 2-second delay (max 2 attempts)
 * - Generates search URLs for each category
 * - Error logging (Requirement 9.4)
 * 
 * @param imageBase64 - Base64 encoded image string
 * @returns Promise<FurnitureCategory[]> - Array of 3-6 furniture categories with search URLs
 * 
 * Requirements: 6.1, 9.3, 9.4
 */
export async function detectFurniture(imageBase64: string): Promise<FurnitureCategory[]> {
  let lastError: Error | null = null;

  // Retry loop (max 2 attempts)
  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`[VisionService] Detecting furniture (attempt ${attempt}/${MAX_RETRY_ATTEMPTS})...`);

      let detectionPromise: Promise<string[]>;

      if (VISION_PROVIDER === 'gemini') {
        detectionPromise = detectFurnitureWithGemini(imageBase64);
      } else if (VISION_PROVIDER === 'openai') {
        detectionPromise = detectFurnitureWithOpenAI(imageBase64);
      } else {
        throw new Error(`Unknown vision provider: ${VISION_PROVIDER}`);
      }

      // Execute with timeout (Requirement 9.3)
      const categories = await withTimeout(detectionPromise, REQUEST_TIMEOUT_MS);

      // Generate search URLs for each category
      const furnitureCategories: FurnitureCategory[] = categories.map(category => ({
        category,
        searchUrls: {
          amazon: `https://www.amazon.in/s?k=${encodeURIComponent(category)}`,
          flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(category)}`,
          pepperfry: `https://www.pepperfry.com/search?q=${encodeURIComponent(category)}`
        }
      }));

      console.log('[VisionService] Furniture detection successful:', furnitureCategories);
      return furnitureCategories;

    } catch (error) {
      lastError = error as Error;
      console.error(`[VisionService] Furniture detection failed (attempt ${attempt}/${MAX_RETRY_ATTEMPTS}):`, error);

      // If not the last attempt, wait before retrying
      if (attempt < MAX_RETRY_ATTEMPTS) {
        console.log('[VisionService] Retrying in 2 seconds...');
        await sleep(2000);
      }
    }
  }

  // All attempts failed - return generic categories
  console.warn('[VisionService] All attempts failed. Using generic furniture categories.');
  console.error('[VisionService] Final error:', lastError);
  
  const genericCategories = ['Sofa', 'Table', 'Lighting', 'Decor', 'Storage'];
  return genericCategories.map(category => ({
    category,
    searchUrls: {
      amazon: `https://www.amazon.in/s?k=${encodeURIComponent(category)}`,
      flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(category)}`,
      pepperfry: `https://www.pepperfry.com/search?q=${encodeURIComponent(category)}`
    }
  }));
}
