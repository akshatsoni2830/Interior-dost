/**
 * API Route: Detect Furniture
 * 
 * Accepts a generated room image and returns furniture categories with shopping URLs
 * Uses Vision Service for detection and Furniture URL Generator for links
 * 
 * POST /api/detect-furniture
 * Body: { imageBase64: string }
 * Response: { success: boolean, data?: FurnitureCategory[], error?: string }
 * 
 * Requirements: 6.1, 8.4, 9.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { detectFurniture } from '@/services/visionService';
import { FurnitureDetectionResponse } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[API /detect-furniture] Request received');
    
    // Parse request body
    const body = await request.json();
    const { imageBase64 } = body;
    
    // Validate input
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      console.error('[API /detect-furniture] Invalid request: missing or invalid imageBase64');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid imageBase64 parameter'
        } as FurnitureDetectionResponse,
        { status: 400 }
      );
    }
    
    // Call vision service to detect furniture (Requirement 6.1)
    // Note: detectFurniture already generates search URLs internally
    console.log('[API /detect-furniture] Calling visionService.detectFurniture()...');
    const furnitureCategories = await detectFurniture(imageBase64);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[API /detect-furniture] Success (${elapsedTime}ms):`, {
      count: furnitureCategories.length,
      categories: furnitureCategories.map(f => f.category)
    });
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: furnitureCategories
      } as FurnitureDetectionResponse,
      { status: 200 }
    );
    
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log error (Requirement 9.4)
    console.error(`[API /detect-furniture] Error (${elapsedTime}ms):`, error);
    
    // Return error response (Requirement 8.4)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as FurnitureDetectionResponse,
      { status: 500 }
    );
  }
}
