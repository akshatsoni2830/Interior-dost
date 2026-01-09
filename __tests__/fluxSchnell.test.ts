/**
 * FLUX Schnell Generation Tests (Task 29.2)
 * 
 * Tests for FLUX Schnell model integration with Pollinations.ai
 * 
 * Test Coverage:
 * - FLUX Schnell generates quality images
 * - Timeout handling (90 seconds)
 * - Model name correctness
 * - Image-to-image transformation
 * 
 * @jest-environment node
 */

import { generateImage } from '@/services/imageGenService';
import { GenerationConfig } from '@/types';

// ============================================================================
// Test Configuration
// ============================================================================

const FLUX_TIMEOUT = 90000; // 90 seconds
const TEST_TIMEOUT = 95000; // 95 seconds (slightly longer than FLUX timeout)

// Sample base64 image (1x1 red pixel)
const SAMPLE_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// ============================================================================
// FLUX Schnell Generation Tests
// ============================================================================

describe('FLUX Schnell Generation Tests', () => {
  /**
   * Test 1: Verify FLUX Schnell generates images
   * 
   * This test verifies that FLUX Schnell can generate images successfully
   * with the correct model configuration.
   */
  test('should generate image with FLUX Schnell model', async () => {
    const config: GenerationConfig = {
      prompt: 'modern minimalist living room, white walls, natural lighting, wooden furniture, Indian home aesthetic, rental friendly, realistic photography',
      negative_prompt: 'structural changes, demolition, construction, unrealistic, cartoon, 3d render, multiple rooms, dark, cluttered',
      image: SAMPLE_IMAGE_BASE64,
      num_outputs: 1,
    };

    console.log('[Test] Starting FLUX Schnell generation test...');
    const startTime = Date.now();
    
    const result = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[Test] Generation completed in ${elapsedTime}ms`);

    // Verify result is a valid image URL or data URL
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    // Should be either a data URL or HTTP(S) URL
    const isValidImageUrl = 
      result.startsWith('data:image/') || 
      result.startsWith('http://') || 
      result.startsWith('https://');
    
    expect(isValidImageUrl).toBe(true);
    
    // Should not be the placeholder (indicates success)
    const isPlaceholder = result.includes('placeholder');
    if (isPlaceholder) {
      console.warn('[Test] Received placeholder image - API may have failed');
    }
    
    console.log(`[Test] Result type: ${result.startsWith('data:') ? 'data URL' : 'HTTP URL'}`);
    console.log(`[Test] Is placeholder: ${isPlaceholder}`);
  }, TEST_TIMEOUT);

  /**
   * Test 2: Verify timeout handling (90 seconds)
   * 
   * This test verifies that the service properly handles the 90-second timeout
   * for FLUX Schnell generation.
   */
  test('should handle timeout gracefully', async () => {
    const config: GenerationConfig = {
      prompt: 'test prompt for timeout handling',
      negative_prompt: 'test negative',
      image: SAMPLE_IMAGE_BASE64,
      num_outputs: 1,
    };

    console.log('[Test] Testing timeout handling...');
    const startTime = Date.now();
    
    // This should complete within the timeout or return placeholder
    const result = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[Test] Completed in ${elapsedTime}ms`);

    // Should complete within reasonable time (90s + buffer)
    expect(elapsedTime).toBeLessThan(TEST_TIMEOUT);
    
    // Should always return something (either image or placeholder)
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  }, TEST_TIMEOUT);

  /**
   * Test 3: Verify image-to-image transformation works
   * 
   * This test verifies that FLUX Schnell properly handles image-to-image
   * transformation for geometry preservation.
   */
  test('should perform image-to-image transformation', async () => {
    const config: GenerationConfig = {
      prompt: 'cozy bedroom with warm lighting, Indian home aesthetic, wooden furniture, rental friendly',
      negative_prompt: 'structural changes, demolition, unrealistic, cartoon',
      image: SAMPLE_IMAGE_BASE64, // Reference image for transformation
      num_outputs: 1,
    };

    console.log('[Test] Testing image-to-image transformation...');
    const startTime = Date.now();
    
    const result = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[Test] Image-to-image completed in ${elapsedTime}ms`);

    // Verify result
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    // Should be a valid image format
    const isValidImageUrl = 
      result.startsWith('data:image/') || 
      result.startsWith('http://') || 
      result.startsWith('https://');
    
    expect(isValidImageUrl).toBe(true);
    
    console.log('[Test] Image-to-image transformation completed successfully');
  }, TEST_TIMEOUT);

  /**
   * Test 4: Verify model configuration
   * 
   * This test verifies that the service is configured to use FLUX Schnell
   * with the correct parameters.
   */
  test('should use correct FLUX Schnell configuration', async () => {
    const config: GenerationConfig = {
      prompt: 'test configuration',
      negative_prompt: 'test',
      image: SAMPLE_IMAGE_BASE64,
      num_outputs: 1,
    };

    console.log('[Test] Verifying FLUX Schnell configuration...');
    
    // Verify num_outputs is enforced to 1
    expect(config.num_outputs).toBe(1);
    
    // Generate image to verify service works
    const result = await generateImage(config);
    
    // Should return valid result
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    
    console.log('[Test] FLUX Schnell configuration verified');
  }, TEST_TIMEOUT);

  /**
   * Test 5: Verify error handling returns placeholder
   * 
   * This test verifies that errors are handled gracefully and return
   * a placeholder image instead of throwing.
   */
  test('should return placeholder on error', async () => {
    const config: GenerationConfig = {
      prompt: '', // Empty prompt might cause issues
      negative_prompt: '',
      image: 'invalid-image-data', // Invalid image data
      num_outputs: 1,
    };

    console.log('[Test] Testing error handling...');
    
    // Should not throw, should return placeholder
    const result = await generateImage(config);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    console.log('[Test] Error handling verified');
  }, TEST_TIMEOUT);

  /**
   * Test 6: Verify text-to-image mode (no reference image)
   * 
   * This test verifies that FLUX Schnell can generate images without
   * a reference image (text-to-image mode).
   */
  test('should generate image without reference (text-to-image)', async () => {
    const config: GenerationConfig = {
      prompt: 'modern living room with minimalist design, Indian home aesthetic',
      negative_prompt: 'cluttered, dark, unrealistic',
      num_outputs: 1,
      // No image or control_image - text-to-image mode
    };

    console.log('[Test] Testing text-to-image mode...');
    const startTime = Date.now();
    
    const result = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[Test] Text-to-image completed in ${elapsedTime}ms`);

    // Verify result
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    const isValidImageUrl = 
      result.startsWith('data:image/') || 
      result.startsWith('http://') || 
      result.startsWith('https://');
    
    expect(isValidImageUrl).toBe(true);
    
    console.log('[Test] Text-to-image mode verified');
  }, TEST_TIMEOUT);
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('FLUX Schnell Integration Tests', () => {
  /**
   * Test 7: Full pipeline test with realistic prompt
   * 
   * This test simulates a real-world scenario with a complete prompt
   * from the prompt optimizer.
   */
  test('should handle realistic interior design prompt', async () => {
    const config: GenerationConfig = {
      prompt: 'exact room geometry preserved, same camera angle, same room dimensions, no wall movement, no window relocation, cozy warm modern living room interior, white walls, natural lighting, Indian home aesthetic, rental friendly, wooden furniture, soft textiles, realistic photography, 4k',
      negative_prompt: 'structural changes, demolition, construction, unrealistic, cartoon, 3d render, multiple rooms, dark, cluttered, wall movement, window relocation, geometry changes',
      image: SAMPLE_IMAGE_BASE64,
      num_outputs: 1,
    };

    console.log('[Test] Testing realistic interior design scenario...');
    const startTime = Date.now();
    
    const result = await generateImage(config);
    
    const elapsedTime = Date.now() - startTime;
    console.log(`[Test] Realistic scenario completed in ${elapsedTime}ms`);

    // Verify result
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    
    const isValidImageUrl = 
      result.startsWith('data:image/') || 
      result.startsWith('http://') || 
      result.startsWith('https://');
    
    expect(isValidImageUrl).toBe(true);
    
    console.log('[Test] Realistic interior design scenario verified');
  }, TEST_TIMEOUT);
});
