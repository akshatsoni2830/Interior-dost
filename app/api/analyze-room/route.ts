/**
 * API Route: Analyze Room
 * 
 * Accepts a room image and returns structured Room_Context using Vision AI
 * 
 * POST /api/analyze-room
 * Body: { imageBase64: string }
 * Response: { success: boolean, data?: RoomContext, error?: string }
 * 
 * Requirements: 2.1, 8.4, 9.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRoom } from '@/services/visionService';
import { VisionAnalysisResponse } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[API /analyze-room] Request received');
    
    // Parse request body
    const body = await request.json();
    const { imageBase64 } = body;
    
    // Validate input
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      console.error('[API /analyze-room] Invalid request: missing or invalid imageBase64');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid imageBase64 parameter'
        } as VisionAnalysisResponse,
        { status: 400 }
      );
    }
    
    // Call vision service
    console.log('[API /analyze-room] Calling visionService.analyzeRoom()...');
    const roomContext = await analyzeRoom(imageBase64);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[API /analyze-room] Success (${elapsedTime}ms):`, roomContext);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: roomContext
      } as VisionAnalysisResponse,
      { status: 200 }
    );
    
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log error (Requirement 9.4)
    console.error(`[API /analyze-room] Error (${elapsedTime}ms):`, error);
    
    // Return error response (Requirement 8.4)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as VisionAnalysisResponse,
      { status: 500 }
    );
  }
}
