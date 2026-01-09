/**
 * Image Generation Service - SDXL Turbo Primary
 * 
 * v2.9: Switched to SDXL Turbo for better image-to-image support
 * 
 * This service handles AI-powered room redesign image generation using:
 * - SDXL Turbo (PRIMARY - Fast, accurate, excellent image-to-image support, and free)
 * 
 * Features:
 * - Image-to-image transformation for geometry preservation
 * - Single image output
 * - Error handling with retry logic
 * - Comprehensive logging
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.4
 */

import { GenerationConfig } from '@/types';
import { loadConfig } from '@/lib/config';

// ============================================================================
// Configuration
// ============================================================================

const GENERATION_TIMEOUT_MS = 90000; // 90 seconds (FLUX is slower but better)
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/512x512?text=Generation+Failed';

// Pollinations.ai - Works with or without API key
const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';

// ============================================================================
// Model Priority List (Best to Worst for Interior Design)
// ============================================================================

type ModelConfig = {
  name: string;
  model: string;
  description: string;
  timeout: number;
  costPerImage: string;
};

const MODELS: ModelConfig[] = [
  {
    name: 'SDXL Turbo',
    model: 'turbo',
    description: 'Fast and accurate with excellent image-to-image support - FREE',
    timeout: 90000, // 90 seconds
    costPerImage: 'FREE',
  },
];

// ============================================================================
// Pollinations.ai Implementation with Multi-Model Support
// ============================================================================

/**
 * Generate image using Pollinations.ai with specific model
 * v2.7: Use POST request with multipart/form-data for image-to-image (avoids 431 error)
 */
async function generateWithModel(
  config: GenerationConfig,
  modelConfig: ModelConfig
): Promise<string> {
  try {
    const appConfig = loadConfig();
    const hasApiKey = !!appConfig.pollinationsApiKey;
    
    console.log(`[ImageGenService] Using ${modelConfig.name} ${hasApiKey ? 'with API key' : '(free tier)'}...`);
    console.log(`[ImageGenService] ${modelConfig.description}`);
    
    const referenceImage = config.image || config.control_image;
    
    // v2.7: Use simple GET request for text-to-image, POST for image-to-image
    if (!referenceImage) {
      // Text-to-image: Simple GET request
      const encodedPrompt = encodeURIComponent(config.prompt);
      const imageUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}?width=1024&height=1024&nologo=true&model=${modelConfig.model}&seed=${Date.now()}`;
      
      console.log('[ImageGenService] Text-to-image mode (no reference)');
      console.log(`[ImageGenService] Fetching from Pollinations.ai...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), modelConfig.timeout);
      
      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Pollinations.ai API error: ${response.status}`);
      }
      
      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      return `data:image/jpeg;base64,${base64}`;
    }
    
    // v2.9: Image-to-image with URL-based approach (CRITICAL for geometry preservation!)
    console.log('[ImageGenService] ========================================');
    console.log('[ImageGenService] IMAGE-TO-IMAGE MODE ACTIVATED');
    console.log('[ImageGenService] ========================================');
    console.log('[ImageGenService] Reference image type:', referenceImage.startsWith('data:') ? 'base64' : 'URL');
    console.log('[ImageGenService] Reference image length:', referenceImage.length);
    console.log('[ImageGenService] Reference image preview:', referenceImage.substring(0, 100) + '...');
    console.log('[ImageGenService] Model:', modelConfig.model);
    console.log('[ImageGenService] Prompt:', config.prompt);
    console.log('[ImageGenService] ========================================');
    
    // For Pollinations.ai, we need to use a different approach
    // The API expects the reference image as a URL parameter, not in POST body
    
    // If we have a base64 image, we need to convert it to a URL
    // For now, let's try a hybrid approach: use the image in the URL if it's a URL,
    // or upload it first if it's base64
    
    let imageUrl = referenceImage;
    
    // If it's a base64 data URL, we need to handle it differently
    if (referenceImage.startsWith('data:')) {
      console.log('[ImageGenService] Reference image is base64, using POST with form data');
      console.log('[ImageGenService] CRITICAL: Testing if Pollinations.ai supports image-to-image via POST');
      
      // Build POST URL
      const encodedPrompt = encodeURIComponent(config.prompt);
      const postUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}`;
      
      // Prepare form data with reference image
      const formData = new FormData();
      
      const base64Data = referenceImage.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      const blob = new Blob([binaryData], { type: 'image/jpeg' });
      formData.append('image', blob, 'reference.jpg');
      
      // Add parameters as form fields
      formData.append('width', '1024');
      formData.append('height', '1024');
      formData.append('model', modelConfig.model);
      formData.append('nologo', 'true');
      formData.append('seed', Date.now().toString());
      
      // CRITICAL: Add strength parameter for image-to-image
      // Lower strength = more faithful to original image geometry
      formData.append('strength', '0.65');
      
      if (config.negative_prompt) {
        formData.append('negative', config.negative_prompt);
      }
      
      console.log(`[ImageGenService] ========================================`);
      console.log(`[ImageGenService] POST REQUEST DETAILS:`);
      console.log(`[ImageGenService] URL: ${postUrl}`);
      console.log(`[ImageGenService] Method: POST`);
      console.log(`[ImageGenService] Has API Key: ${hasApiKey}`);
      console.log(`[ImageGenService] Form Data Fields:`);
      console.log(`[ImageGenService]   - image: Blob (${blob.size} bytes)`);
      console.log(`[ImageGenService]   - width: 1024`);
      console.log(`[ImageGenService]   - height: 1024`);
      console.log(`[ImageGenService]   - model: ${modelConfig.model}`);
      console.log(`[ImageGenService]   - strength: 0.65 (CRITICAL for image-to-image)`);
      console.log(`[ImageGenService]   - nologo: true`);
      console.log(`[ImageGenService]   - seed: ${Date.now()}`);
      console.log(`[ImageGenService] ========================================`);
      console.log(`[ImageGenService] Sending POST request...`);
      console.log(`[ImageGenService] This may take ${modelConfig.timeout / 1000} seconds...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), modelConfig.timeout);
      
      const fetchOptions: RequestInit = {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {} as Record<string, string>,
      };
      
      // Add API key if available
      if (hasApiKey && appConfig.pollinationsApiKey) {
        fetchOptions.headers = {
          'X-API-Key': appConfig.pollinationsApiKey,
        };
      }
      
      const response = await fetch(postUrl, fetchOptions);
      clearTimeout(timeoutId);
      
      console.log(`[ImageGenService] ========================================`);
      console.log(`[ImageGenService] POST RESPONSE:`);
      console.log(`[ImageGenService] Status: ${response.status} ${response.statusText}`);
      console.log(`[ImageGenService] Headers:`, Object.fromEntries(response.headers.entries()));
      console.log(`[ImageGenService] ========================================`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ImageGenService] API Error Response:`, errorText);
        throw new Error(`Pollinations.ai API error: ${response.status} - ${errorText}`);
      }
      
      // Get the generated image
      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const imageDataUrl = `data:image/jpeg;base64,${base64}`;

      console.log(`[ImageGenService] ========================================`);
      console.log(`[ImageGenService] SUCCESS: Image generated with ${modelConfig.name}`);
      console.log(`[ImageGenService] Generated image size: ${imageBlob.size} bytes`);
      console.log(`[ImageGenService] Base64 length: ${base64.length} characters`);
      console.log(`[ImageGenService] ========================================`);
      
      return imageDataUrl;
    }
    
    // If it's a URL, use GET request with image parameter
    console.log('[ImageGenService] Reference image is URL, using GET with image parameter');
    const encodedPrompt = encodeURIComponent(config.prompt);
    const encodedImageUrl = encodeURIComponent(imageUrl);
    
    // Build URL with all parameters including the reference image
    const getUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}?` +
      `width=1024&height=1024&` +
      `model=${modelConfig.model}&` +
      `nologo=true&` +
      `seed=${Date.now()}&` +
      `image=${encodedImageUrl}&` +
      `strength=0.65`;
    
    console.log(`[ImageGenService] Fetching with image-to-image (strength=0.65)...`);
    console.log(`[ImageGenService] This may take ${modelConfig.timeout / 1000} seconds...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), modelConfig.timeout);
    
    const response = await fetch(getUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Pollinations.ai API error: ${response.status}`);
    }
    
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64}`;

    console.log(`[ImageGenService] Image generated successfully with ${modelConfig.name}`);
    return imageDataUrl;

  } catch (error) {
    console.error(`[ImageGenService] ${modelConfig.name} generation failed:`, error);
    throw error;
  }
}

// ============================================================================
// Main Generation Function with Multi-Model Fallback
// ============================================================================

/**
 * Generate a redesigned room image using Pollinations.ai with SDXL Turbo
 * 
 * v2.9 Features:
 * - Uses SDXL Turbo (fast, accurate, excellent image-to-image support, free)
 * - Image-to-image transformation for geometry preservation
 * - Generates exactly 1 image (Requirement 5.3)
 * - Returns placeholder on failure (Requirement 9.2)
 * - Logs all errors (Requirement 9.4)
 * 
 * @param config - Generation configuration with prompts and reference image
 * @returns Promise<string> - URL of generated image or placeholder
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.4
 */
export async function generateImage(config: GenerationConfig): Promise<string> {
  try {
    console.log('[ImageGenService] Starting image generation with SDXL Turbo...');
    
    console.log('[ImageGenService] Config:', {
      controlnet_type: config.controlnet_type,
      num_outputs: config.num_outputs,
      prompt_length: config.prompt.length,
      negative_prompt_length: config.negative_prompt.length,
      has_reference_image: !!(config.image || config.control_image),
    });

    // Validate configuration (Requirement 5.3)
    if (config.num_outputs !== 1) {
      console.warn('[ImageGenService] num_outputs must be 1, forcing to 1');
      config.num_outputs = 1;
    }

    const startTime = Date.now();
    let lastError: Error | null = null;
    
    // Try each model in priority order
    for (const modelConfig of MODELS) {
      try {
        console.log(`[ImageGenService] Attempting with ${modelConfig.name}...`);
        
        const imageUrl = await generateWithModel(config, modelConfig);
        
        const elapsedTime = Date.now() - startTime;
        console.log(`[ImageGenService] Generation completed in ${elapsedTime}ms`);
        console.log(`[ImageGenService] Success with ${modelConfig.name}!`);
        
        return imageUrl;
      } catch (error) {
        lastError = error as Error;
        console.error(`[ImageGenService] ${modelConfig.name} failed:`, error);
        console.log(`[ImageGenService] Trying next model...`);
        
        // Wait 2 seconds before trying next model
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // All models failed
    throw lastError || new Error('All models failed');

  } catch (error) {
    // Log error (Requirement 9.4)
    console.error('[ImageGenService] Image generation failed after all models:', error);
    
    // Return placeholder image (Requirement 9.2)
    console.warn('[ImageGenService] Returning placeholder image');
    return PLACEHOLDER_IMAGE_URL;
  }
}

/**
 * Generate image with explicit timeout handling
 * This is an alternative implementation that provides more control over timeout
 */
export async function generateImageWithTimeout(
  config: GenerationConfig,
  timeoutMs: number = GENERATION_TIMEOUT_MS
): Promise<string> {
  return Promise.race([
    generateImage(config),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error(`Generation timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]).catch(error => {
    console.error('[ImageGenService] Generation failed or timed out:', error);
    console.warn('[ImageGenService] Returning placeholder image');
    return PLACEHOLDER_IMAGE_URL;
  });
}
