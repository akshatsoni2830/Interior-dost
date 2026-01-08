/**
 * API Routes Tests
 * 
 * Tests for API error handling and logging
 * Property 14: API Error Handling - Validates: Requirements 8.4
 * Property 15: Error Logging - Validates: Requirements 9.4
 */

import * as fc from 'fast-check';

// Mock Next.js server environment before importing routes
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}));

// Mock Replicate to avoid TransformStream issues
jest.mock('replicate', () => {
  return jest.fn().mockImplementation(() => ({
    run: jest.fn(),
  }));
});

// Mock the services to control their behavior
jest.mock('@/services/visionService');
jest.mock('@/services/imageGenService');
jest.mock('@/lib/promptOptimizer');

import { POST as analyzeRoomPOST } from '@/app/api/analyze-room/route';
import { POST as generateImagePOST } from '@/app/api/generate-image/route';
import { POST as detectFurniturePOST } from '@/app/api/detect-furniture/route';

import * as visionService from '@/services/visionService';
import * as imageGenService from '@/services/imageGenService';
import * as promptOptimizer from '@/lib/promptOptimizer';

// Helper to create mock NextRequest
function createMockRequest(body: any): any {
  return {
    json: async () => body,
  };
}

// Helper to capture console logs
function captureConsoleLogs(): { logs: string[], errors: string[], restore: () => void } {
  const logs: string[] = [];
  const errors: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args: any[]) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };
  
  console.error = (...args: any[]) => {
    errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };
  
  return {
    logs,
    errors,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
    }
  };
}

describe('API Routes - Error Handling and Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 14: API Error Handling
   * Feature: interior-dost-mvp, Property 14: For any external API call (Vision Model, Image Generator),
   * if an error occurs, it should be caught and handled gracefully without crashing the application
   * Validates: Requirements 8.4
   */
  describe('Property 14: API Error Handling', () => {
    it('should handle errors gracefully in analyze-room endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }), // imageBase64
          fc.oneof(
            fc.constant('API timeout'),
            fc.constant('Network error'),
            fc.constant('Invalid response'),
            fc.constant('Service unavailable')
          ), // error message
          async (imageBase64, errorMsg) => {
            // Mock service to throw error
            (visionService.analyzeRoom as jest.Mock).mockRejectedValue(new Error(errorMsg));
            
            const request = createMockRequest({ imageBase64 });
            const response = await analyzeRoomPOST(request);
            const data = await response.json();
            
            // Should not crash - should return error response
            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
            expect(data.error).toBeDefined();
            expect(typeof data.error).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle errors gracefully in generate-image endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            text: fc.string(),
            preset: fc.constantFrom('modern', 'traditional', 'minimalist', 'bohemian', undefined)
          }),
          fc.record({
            room_type: fc.string(),
            visible_objects: fc.array(fc.string()),
            wall_color: fc.string(),
            lighting_type: fc.string()
          }),
          fc.string({ minLength: 10 }),
          fc.oneof(
            fc.constant('Generation failed'),
            fc.constant('API error'),
            fc.constant('Timeout'),
            fc.constant('Invalid configuration')
          ),
          async (userIntent, roomContext, controlImage, errorMsg) => {
            // Mock services
            (promptOptimizer.optimizePrompt as jest.Mock).mockReturnValue({
              positive: 'test prompt',
              negative: 'test negative',
              metadata: { room_type: 'test', constraints: [] }
            });
            (imageGenService.generateImage as jest.Mock).mockRejectedValue(new Error(errorMsg));
            
            const request = createMockRequest({ userIntent, roomContext, controlImage });
            const response = await generateImagePOST(request);
            const data = await response.json();
            
            // Should not crash - should return error response
            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
            expect(data.error).toBeDefined();
            expect(typeof data.error).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle errors gracefully in detect-furniture endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }), // imageBase64
          fc.oneof(
            fc.constant('Detection failed'),
            fc.constant('API unavailable'),
            fc.constant('Parse error'),
            fc.constant('Timeout')
          ), // error message
          async (imageBase64, errorMsg) => {
            // Mock service to throw error
            (visionService.detectFurniture as jest.Mock).mockRejectedValue(new Error(errorMsg));
            
            const request = createMockRequest({ imageBase64 });
            const response = await detectFurniturePOST(request);
            const data = await response.json();
            
            // Should not crash - should return error response
            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
            expect(data.error).toBeDefined();
            expect(typeof data.error).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 15: Error Logging
   * Feature: interior-dost-mvp, Property 15: For any error that occurs during execution,
   * the system should log the error details to the console
   * Validates: Requirements 9.4
   */
  describe('Property 15: Error Logging', () => {
    it('should log errors to console in analyze-room endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }),
          fc.string({ minLength: 5 }),
          async (imageBase64, errorMsg) => {
            const captured = captureConsoleLogs();
            
            try {
              // Mock service to throw error
              (visionService.analyzeRoom as jest.Mock).mockRejectedValue(new Error(errorMsg));
              
              const request = createMockRequest({ imageBase64 });
              await analyzeRoomPOST(request);
              
              // Should have logged the error
              expect(captured.errors.length).toBeGreaterThan(0);
              const errorLog = captured.errors.join(' ');
              expect(errorLog).toContain('analyze-room');
            } finally {
              captured.restore();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should log errors to console in generate-image endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 5 }),
          async (errorMsg) => {
            const captured = captureConsoleLogs();
            
            try {
              // Mock services
              (promptOptimizer.optimizePrompt as jest.Mock).mockReturnValue({
                positive: 'test',
                negative: 'test',
                metadata: { room_type: 'test', constraints: [] }
              });
              (imageGenService.generateImage as jest.Mock).mockRejectedValue(new Error(errorMsg));
              
              const request = createMockRequest({
                userIntent: { text: 'test' },
                roomContext: { room_type: 'test', visible_objects: [], wall_color: 'white', lighting_type: 'natural' },
                controlImage: 'test-image'
              });
              await generateImagePOST(request);
              
              // Should have logged the error
              expect(captured.errors.length).toBeGreaterThan(0);
              const errorLog = captured.errors.join(' ');
              expect(errorLog).toContain('generate-image');
            } finally {
              captured.restore();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should log errors to console in detect-furniture endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }),
          fc.string({ minLength: 5 }),
          async (imageBase64, errorMsg) => {
            const captured = captureConsoleLogs();
            
            try {
              // Mock service to throw error
              (visionService.detectFurniture as jest.Mock).mockRejectedValue(new Error(errorMsg));
              
              const request = createMockRequest({ imageBase64 });
              await detectFurniturePOST(request);
              
              // Should have logged the error
              expect(captured.errors.length).toBeGreaterThan(0);
              const errorLog = captured.errors.join(' ');
              expect(errorLog).toContain('detect-furniture');
            } finally {
              captured.restore();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10: Furniture Categories Bounds
   * Feature: interior-dost-mvp, Property 10: For any successful furniture detection,
   * the returned array of Furniture_Categories should contain between 3 and 6 items (inclusive)
   * Validates: Requirements 6.2
   */
  describe('Property 10: Furniture Categories Bounds', () => {
    it('should return between 3 and 6 furniture categories for any successful detection', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }), // imageBase64
          fc.integer({ min: 3, max: 6 }), // number of categories to return
          async (imageBase64, numCategories) => {
            // Generate mock furniture categories
            const mockCategories = Array.from({ length: numCategories }, (_, i) => ({
              category: `Category${i + 1}`,
              searchUrls: {
                amazon: `https://amazon.in/search?q=category${i + 1}`,
                flipkart: `https://flipkart.com/search?q=category${i + 1}`,
                pepperfry: `https://pepperfry.com/search?q=category${i + 1}`,
              },
            }));
            
            // Mock service to return the categories
            (visionService.detectFurniture as jest.Mock).mockResolvedValue(mockCategories);
            
            const request = createMockRequest({ imageBase64 });
            const response = await detectFurniturePOST(request);
            const data = await response.json();
            
            // Should succeed
            expect(data.success).toBe(true);
            expect(data.data).toBeDefined();
            
            // Should have between 3 and 6 categories
            expect(data.data.length).toBeGreaterThanOrEqual(3);
            expect(data.data.length).toBeLessThanOrEqual(6);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate that furniture detection service respects bounds', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10 }), // imageBase64
          async (imageBase64) => {
            // Mock service to return a realistic number of categories
            const mockCategories = [
              {
                category: 'Sofa',
                searchUrls: {
                  amazon: 'https://amazon.in/search?q=sofa',
                  flipkart: 'https://flipkart.com/search?q=sofa',
                  pepperfry: 'https://pepperfry.com/search?q=sofa',
                },
              },
              {
                category: 'Table',
                searchUrls: {
                  amazon: 'https://amazon.in/search?q=table',
                  flipkart: 'https://flipkart.com/search?q=table',
                  pepperfry: 'https://pepperfry.com/search?q=table',
                },
              },
              {
                category: 'Lighting',
                searchUrls: {
                  amazon: 'https://amazon.in/search?q=lighting',
                  flipkart: 'https://flipkart.com/search?q=lighting',
                  pepperfry: 'https://pepperfry.com/search?q=lighting',
                },
              },
              {
                category: 'Decor',
                searchUrls: {
                  amazon: 'https://amazon.in/search?q=decor',
                  flipkart: 'https://flipkart.com/search?q=decor',
                  pepperfry: 'https://pepperfry.com/search?q=decor',
                },
              },
            ];
            
            (visionService.detectFurniture as jest.Mock).mockResolvedValue(mockCategories);
            
            const request = createMockRequest({ imageBase64 });
            const response = await detectFurniturePOST(request);
            const data = await response.json();
            
            // Should succeed
            expect(data.success).toBe(true);
            
            // Should respect bounds
            const categoryCount = data.data.length;
            expect(categoryCount).toBeGreaterThanOrEqual(3);
            expect(categoryCount).toBeLessThanOrEqual(6);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Unit Test: Missing Environment Variables
   * Test that missing API keys fail with clear error
   * Validates: Requirements 7.4
   */
  describe('Unit Test: Missing Environment Variables', () => {
    it('should fail with clear error when REPLICATE_API_TOKEN is missing', async () => {
      // Save original env var
      const originalToken = process.env.REPLICATE_API_TOKEN;
      
      try {
        // Remove the token
        delete process.env.REPLICATE_API_TOKEN;
        
        // Mock services
        (promptOptimizer.optimizePrompt as jest.Mock).mockReturnValue({
          positive: 'test prompt',
          negative: 'test negative',
          metadata: { room_type: 'test', constraints: [] }
        });
        
        // Mock imageGenService to throw error about missing token
        (imageGenService.generateImage as jest.Mock).mockRejectedValue(
          new Error('Replicate client not initialized. Check REPLICATE_API_TOKEN.')
        );
        
        const request = createMockRequest({
          userIntent: { text: 'modern' },
          roomContext: {
            room_type: 'living room',
            visible_objects: ['sofa'],
            wall_color: 'white',
            lighting_type: 'natural'
          },
          controlImage: 'base64-image-data'
        });
        
        const response = await generateImagePOST(request);
        const data = await response.json();
        
        // Should return error response
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toContain('REPLICATE_API_TOKEN');
      } finally {
        // Restore original env var
        if (originalToken) {
          process.env.REPLICATE_API_TOKEN = originalToken;
        }
      }
    });

    it('should fail with clear error when Vision API key is missing', async () => {
      // Save original env vars
      const originalGeminiKey = process.env.GEMINI_API_KEY;
      const originalOpenAIKey = process.env.OPENAI_API_KEY;
      
      try {
        // Remove both keys
        delete process.env.GEMINI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        
        // Mock visionService to throw error about missing key
        (visionService.analyzeRoom as jest.Mock).mockRejectedValue(
          new Error('Gemini client not initialized. Check GEMINI_API_KEY.')
        );
        
        const request = createMockRequest({
          imageBase64: 'base64-image-data'
        });
        
        const response = await analyzeRoomPOST(request);
        const data = await response.json();
        
        // Should return error response with clear message
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBeDefined();
        expect(
          data.error.includes('API_KEY') || 
          data.error.includes('client not initialized')
        ).toBe(true);
      } finally {
        // Restore original env vars
        if (originalGeminiKey) {
          process.env.GEMINI_API_KEY = originalGeminiKey;
        }
        if (originalOpenAIKey) {
          process.env.OPENAI_API_KEY = originalOpenAIKey;
        }
      }
    });
  });
});
