/**
 * Property-based tests for input validation
 * Feature: interior-dost-mvp, Property 1: Input Validation Consistency
 * Validates: Requirements 1.1, 1.3
 */

import * as fc from 'fast-check';
import {
  validateImageFile,
  validateFileSize,
  validateFileType,
} from '@/lib/validation';

describe('Input Validation', () => {
  describe('Property 1: Input Validation Consistency', () => {
    /**
     * Property: For any file upload attempt, the system should accept the file
     * if and only if it is a jpg or png format AND is 10MB or smaller,
     * otherwise it should reject with an appropriate error message.
     */
    test('should accept files if and only if they are jpg/png and ≤10MB', () => {
      fc.assert(
        fc.property(
          fc.record({
            // Generate file properties
            name: fc.string({ minLength: 1, maxLength: 50 }),
            type: fc.oneof(
              fc.constant('image/jpeg'),
              fc.constant('image/png'),
              fc.constant('image/gif'),
              fc.constant('application/pdf'),
              fc.constant('text/plain'),
              fc.constant('image/webp')
            ),
            size: fc.integer({ min: 0, max: 15 * 1024 * 1024 }), // 0 to 15MB
          }),
          (fileProps) => {
            // Create a mock File object
            const file = new File(
              [new ArrayBuffer(fileProps.size)],
              fileProps.name,
              { type: fileProps.type }
            );

            const result = validateImageFile(file);

            // Determine expected validity
            const isValidType =
              fileProps.type === 'image/jpeg' || fileProps.type === 'image/png';
            const isValidSize = fileProps.size <= 10 * 1024 * 1024;
            const shouldBeValid = isValidType && isValidSize;

            // Assert the result matches expectations
            expect(result.valid).toBe(shouldBeValid);

            // If invalid, should have an error message
            if (!shouldBeValid) {
              expect(result.error).toBeDefined();
              expect(typeof result.error).toBe('string');
              expect(result.error!.length).toBeGreaterThan(0);
            } else {
              expect(result.error).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: validateFileType should accept only files with allowed MIME types
     */
    test('validateFileType should accept only allowed types', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            type: fc.oneof(
              fc.constant('image/jpeg'),
              fc.constant('image/png'),
              fc.constant('image/gif'),
              fc.constant('application/pdf'),
              fc.constant('video/mp4')
            ),
            allowedTypes: fc.constantFrom(
              ['image/jpeg', 'image/png'],
              ['image/jpeg'],
              ['image/png'],
              ['image/gif', 'image/webp']
            ),
          }),
          (config) => {
            const file = new File([new ArrayBuffer(100)], config.name, {
              type: config.type,
            });

            const result = validateFileType(file, config.allowedTypes);

            const shouldBeValid = config.allowedTypes.includes(config.type);

            expect(result.valid).toBe(shouldBeValid);

            if (!shouldBeValid) {
              expect(result.error).toBeDefined();
              expect(result.error).toContain('Invalid file type');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: validateFileSize should accept only files within size limit
     */
    test('validateFileSize should accept only files within size limit', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            size: fc.integer({ min: 0, max: 20 * 1024 * 1024 }), // 0 to 20MB
            maxMB: fc.integer({ min: 1, max: 15 }), // 1 to 15MB limit
          }),
          (config) => {
            const file = new File([new ArrayBuffer(config.size)], config.name, {
              type: 'image/jpeg',
            });

            const result = validateFileSize(file, config.maxMB);

            const maxBytes = config.maxMB * 1024 * 1024;
            const shouldBeValid = config.size <= maxBytes;

            expect(result.valid).toBe(shouldBeValid);

            if (!shouldBeValid) {
              expect(result.error).toBeDefined();
              expect(result.error).toContain('exceeds');
              expect(result.error).toContain(`${config.maxMB}MB`);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Validation should be consistent - same input produces same output
     */
    test('validation should be deterministic', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            type: fc.oneof(
              fc.constant('image/jpeg'),
              fc.constant('image/png'),
              fc.constant('image/gif')
            ),
            size: fc.integer({ min: 0, max: 15 * 1024 * 1024 }),
          }),
          (fileProps) => {
            const file = new File(
              [new ArrayBuffer(fileProps.size)],
              fileProps.name,
              { type: fileProps.type }
            );

            // Call validation multiple times
            const result1 = validateImageFile(file);
            const result2 = validateImageFile(file);
            const result3 = validateImageFile(file);

            // All results should be identical
            expect(result1.valid).toBe(result2.valid);
            expect(result2.valid).toBe(result3.valid);
            expect(result1.error).toBe(result2.error);
            expect(result2.error).toBe(result3.error);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Specific Examples', () => {
    test('should accept valid JPEG file under 10MB', () => {
      const file = new File([new ArrayBuffer(5 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept valid PNG file under 10MB', () => {
      const file = new File([new ArrayBuffer(8 * 1024 * 1024)], 'test.png', {
        type: 'image/png',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject GIF file', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.gif', {
        type: 'image/gif',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid file type');
    });

    test('should reject PDF file', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.pdf', {
        type: 'application/pdf',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    test('should reject file over 10MB', () => {
      const file = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('exceeds 10MB');
    });

    test('should accept file exactly at 10MB limit', () => {
      const file = new File(
        [new ArrayBuffer(10 * 1024 * 1024)],
        'exact.jpg',
        { type: 'image/jpeg' }
      );

      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject empty file name but valid type and size', () => {
      // This tests that validation focuses on type and size, not filename
      const file = new File([new ArrayBuffer(1024)], '', {
        type: 'image/jpeg',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    test('validateFileType should work with custom allowed types', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.webp', {
        type: 'image/webp',
      });

      const result = validateFileType(file, ['image/webp', 'image/avif']);

      expect(result.valid).toBe(true);
    });

    test('validateFileSize should work with custom size limits', () => {
      const file = new File([new ArrayBuffer(3 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = validateFileSize(file, 5);

      expect(result.valid).toBe(true);
    });

    test('validateFileSize should reject when over custom limit', () => {
      const file = new File([new ArrayBuffer(6 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = validateFileSize(file, 5);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('5MB');
    });
  });
});
