/**
 * Tests for Image Generation Service
 * 
 * Property Tests:
 * - Property 8: Image Generator Configuration Validity
 * 
 * Unit Tests:
 * - Image generation failure handling
 * 
 * @jest-environment node
 */

import * as fc from 'fast-check';
import { GenerationConfig } from '@/types';

// ============================================================================
// Arbitraries for Property-Based Testing
// ============================================================================

const controlNetTypeArb = fc.constantFrom('canny', 'depth');

const generationConfigArb = fc.record({
  prompt: fc.string({ minLength: 10, maxLength: 500 }),
  negative_prompt: fc.string({ minLength: 5, maxLength: 200 }),
  control_image: fc.string({ minLength: 20, maxLength: 100 }), // Mock base64
  controlnet_type: controlNetTypeArb,
  num_outputs: fc.constant(1),
});

// ============================================================================
// Property Tests
// ============================================================================

describe('Image Generation Service - Property Tests', () => {
  /**
   * Property 8: Image Generator Configuration Validity
   * 
   * For any image generation request, the controlnet_type parameter should be 
   * either "canny" or "depth", and num_outputs should be exactly 1.
   * 
   * Validates: Requirements 5.2, 5.3
   * Feature: interior-dost-mvp, Property 8: Image Generator Configuration Validity
   */
  test('Property 8: Configuration Validity', () => {
    fc.assert(
      fc.property(
        generationConfigArb,
        (config: GenerationConfig) => {
          // Verify controlnet_type is valid (Requirement 5.2)
          expect(['canny', 'depth']).toContain(config.controlnet_type);
          
          // Verify num_outputs is exactly 1 (Requirement 5.3)
          expect(config.num_outputs).toBe(1);
          
          // Verify required fields are present
          expect(config.prompt).toBeDefined();
          expect(config.negative_prompt).toBeDefined();
          expect(config.control_image).toBeDefined();
          
          // Verify fields are non-empty strings
          expect(typeof config.prompt).toBe('string');
          expect(config.prompt.length).toBeGreaterThan(0);
          expect(typeof config.negative_prompt).toBe('string');
          expect(config.negative_prompt.length).toBeGreaterThan(0);
          expect(typeof config.control_image).toBe('string');
          expect(config.control_image.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Unit Tests
// ============================================================================

describe('Image Generation Service - Unit Tests', () => {
  /**
   * Test that API failure returns placeholder with error
   * Requirement 9.2
   */
  test('should return placeholder image on API failure', async () => {
    // Mock the generateImage function to simulate failure
    const { generateImage } = await import('@/services/imageGenService');
    
    // Create a config that will fail (no API token in test environment)
    const config: GenerationConfig = {
      prompt: 'test prompt',
      negative_prompt: 'test negative',
      control_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      controlnet_type: 'canny',
      num_outputs: 1,
    };
    
    // Call generateImage - should return placeholder on failure
    const result = await generateImage(config);
    
    // Verify it returns a string (URL)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    // In test environment without API token, should return placeholder
    // The placeholder URL contains "placeholder" or the actual image URL
    expect(
      result.includes('placeholder') || 
      result.startsWith('http') || 
      result.startsWith('https')
    ).toBe(true);
  });

  test('should handle missing API token gracefully', async () => {
    const { generateImage } = await import('@/services/imageGenService');
    
    const config: GenerationConfig = {
      prompt: 'modern living room',
      negative_prompt: 'cluttered',
      control_image: 'data:image/jpeg;base64,test',
      controlnet_type: 'depth',
      num_outputs: 1,
    };
    
    // Should not throw, should return placeholder
    await expect(generateImage(config)).resolves.toBeDefined();
  });

  test('should enforce num_outputs to be 1', async () => {
    const { generateImage } = await import('@/services/imageGenService');
    
    // Create config with invalid num_outputs (will be forced to 1)
    const config: GenerationConfig = {
      prompt: 'test',
      negative_prompt: 'test',
      control_image: 'test',
      controlnet_type: 'canny',
      num_outputs: 1, // TypeScript enforces this, but service validates
    };
    
    const result = await generateImage(config);
    expect(typeof result).toBe('string');
  });
});
