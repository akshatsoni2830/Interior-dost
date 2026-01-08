/**
 * Image Generation Service - FREE via Pollinations.ai
 * 
 * This service handles AI-powered room redesign image generation using:
 * - Pollinations.ai (100% FREE, no API key needed!)
 * - Stable Diffusion models
 * - No credit card required!
 * 
 * Features:
 * - 100% FREE API (no limits, no API key)
 * - Single image output
 * - Error handling with fallback placeholder
 * - Comprehensive logging
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.4
 */

import { GenerationConfig } from '@/types';

// ============================================================================
// Configuration
// ============================================================================

const GENERATION_TIMEOUT_MS = 60000; // 60 seconds
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/512x512?text=Generation+Failed';

// Pollinations.ai - 100% FREE, no API key needed!
const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';

// ============================================================================
// Pollinations.ai Implementation (100% FREE)
// ============================================================================

/**
 * Generate image using Pollinations.ai (100% FREE)
 * No API key, no signup, no credit card needed!
 */
async function generateImageWithPollinations(config: GenerationConfig): Promise<string> {
  try {
    console.log('[ImageGenService] Using Pollinations.ai (100% FREE)...');
    
    // Pollinations.ai uses a simple URL-based API
    // Format: https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&seed={seed}&nologo=true
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(config.prompt);
    
    // Build the URL with parameters
    const imageUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}?width=512&height=512&nologo=true&enhance=true`;
    
    console.log('[ImageGenService] Fetching from Pollinations.ai...');
    console.log('[ImageGenService] This may take 30-60 seconds...');
    
    // Fetch the image with longer timeout (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Pollinations.ai API error: ${response.status}`);
    }
    
    // Get the image blob
    const imageBlob = await response.blob();
    
    // Convert blob to base64 data URL for display (Node.js compatible)
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64}`;

    console.log('[ImageGenService] Image generated successfully with Pollinations.ai');
    return imageDataUrl;

  } catch (error) {
    console.error('[ImageGenService] Pollinations.ai generation failed:', error);
    throw error;
  }
}

// ============================================================================
// Main Generation Function
// ============================================================================

/**
 * Generate a redesigned room image using Pollinations.ai (100% FREE)
 * 
 * Features:
 * - 100% FREE (no API key, no signup, no credit card)
 * - Generates exactly 1 image (Requirement 5.3)
 * - Returns placeholder on failure (Requirement 9.2)
 * - Logs all errors (Requirement 9.4)
 * - Retry logic for reliability
 * 
 * @param config - Generation configuration with prompts
 * @returns Promise<string> - URL of generated image or placeholder
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.4
 */
export async function generateImage(config: GenerationConfig): Promise<string> {
  try {
    console.log('[ImageGenService] Starting image generation...');
    console.log('[ImageGenService] Config:', {
      controlnet_type: config.controlnet_type,
      num_outputs: config.num_outputs,
      prompt_length: config.prompt.length,
      negative_prompt_length: config.negative_prompt.length,
      provider: 'Pollinations.ai (100% FREE)'
    });

    // Validate configuration (Requirement 5.3)
    if (config.num_outputs !== 1) {
      console.warn('[ImageGenService] num_outputs must be 1, forcing to 1');
      config.num_outputs = 1;
    }

    const startTime = Date.now();
    let imageUrl: string;
    let lastError: Error | null = null;
    
    // Retry up to 2 times if it fails
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[ImageGenService] Attempt ${attempt}/${maxRetries}...`);
        imageUrl = await generateImageWithPollinations(config);
        
        const elapsedTime = Date.now() - startTime;
        console.log(`[ImageGenService] Generation completed in ${elapsedTime}ms`);
        console.log('[ImageGenService] Image generated successfully');
        
        return imageUrl;
      } catch (error) {
        lastError = error as Error;
        console.error(`[ImageGenService] Attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          console.log('[ImageGenService] Retrying in 3 seconds...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    // All retries failed
    throw lastError;

  } catch (error) {
    // Log error (Requirement 9.4)
    console.error('[ImageGenService] Image generation failed after all retries:', error);
    
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
