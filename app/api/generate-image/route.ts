/**
 * API Route: Generate Image
 * 
 * Accepts user intent, room context, and control image to generate a redesigned room image
 * Uses Prompt Optimizer and Image Generation Service
 * 
 * POST /api/generate-image
 * Body: { userIntent: UserIntent, roomContext: RoomContext, controlImage: string }
 * Response: { success: boolean, imageUrl?: string, error?: string }
 * 
 * Requirements: 4.1, 5.1, 8.4, 9.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { optimizePrompt } from '@/lib/promptOptimizer';
import { generateImage } from '@/services/imageGenService';
import { UserIntent, RoomContext, ImageGenerationResponse, GenerationConfig } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[API /generate-image] Request received');
    
    // Parse request body
    const body = await request.json();
    const { userIntent, roomContext, controlImage } = body;
    
    // Validate input
    if (!userIntent || !roomContext || !controlImage) {
      console.error('[API /generate-image] Invalid request: missing required parameters');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: userIntent, roomContext, or controlImage'
        } as ImageGenerationResponse,
        { status: 400 }
      );
    }
    
    // Validate types
    if (typeof userIntent !== 'object' || typeof roomContext !== 'object') {
      console.error('[API /generate-image] Invalid request: invalid parameter types');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameter types for userIntent or roomContext'
        } as ImageGenerationResponse,
        { status: 400 }
      );
    }
    
    // Step 1: Optimize prompt (Requirement 4.1)
    console.log('[API /generate-image] Optimizing prompt...');
    const optimizedPrompt = optimizePrompt(
      userIntent as UserIntent,
      roomContext as RoomContext
    );
    
    console.log('[API /generate-image] Optimized prompt:', {
      positive_length: optimizedPrompt.positive.length,
      negative_length: optimizedPrompt.negative.length,
      room_type: optimizedPrompt.metadata.room_type
    });
    
    // Step 2: Generate image (Requirement 5.1)
    console.log('[API /generate-image] Generating image...');
    const config: GenerationConfig = {
      prompt: optimizedPrompt.positive,
      negative_prompt: optimizedPrompt.negative,
      control_image: controlImage,
      controlnet_type: 'canny',
      num_outputs: 1
    };
    
    const imageUrl = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[API /generate-image] Success (${elapsedTime}ms):`, imageUrl);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        imageUrl,
        data: imageUrl
      } as ImageGenerationResponse,
      { status: 200 }
    );
    
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log error (Requirement 9.4)
    console.error(`[API /generate-image] Error (${elapsedTime}ms):`, error);
    
    // Return error response (Requirement 8.4)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as ImageGenerationResponse,
      { status: 500 }
    );
  }
}
