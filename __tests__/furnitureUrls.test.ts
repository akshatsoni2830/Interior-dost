/**
 * Property-based tests for furniture URL generation
 * Feature: interior-dost-mvp, Property 11: Furniture Category URL Completeness
 * Validates: Requirements 6.3
 */

import * as fc from 'fast-check';
import { generateSearchUrls } from '@/lib/furnitureUrls';

describe('Furniture URL Generator', () => {
  describe('Property 11: Furniture Category URL Completeness', () => {
    /**
     * Property: For any FurnitureCategory object, it should contain searchUrls
     * with all three required fields: amazon, flipkart, and pepperfry,
     * each containing a valid URL string.
     */
    test('should generate all three required platform URLs for any category', () => {
      fc.assert(
        fc.property(
          // Generate various furniture category strings
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 50 }),
            fc.constantFrom(
              'Sofa',
              'Coffee Table',
              'Rug',
              'Dining Table',
              'Bed',
              'Wardrobe',
              'Chair',
              'Bookshelf',
              'TV Unit',
              'Side Table',
              'Lamp',
              'Curtains',
              'Wall Art',
              'Mirror',
              'Storage Cabinet'
            )
          ),
          (category) => {
            const result = generateSearchUrls(category);

            // Should have all three required fields
            expect(result).toHaveProperty('amazon');
            expect(result).toHaveProperty('flipkart');
            expect(result).toHaveProperty('pepperfry');

            // All fields should be strings
            expect(typeof result.amazon).toBe('string');
            expect(typeof result.flipkart).toBe('string');
            expect(typeof result.pepperfry).toBe('string');

            // All fields should be non-empty
            expect(result.amazon.length).toBeGreaterThan(0);
            expect(result.flipkart.length).toBeGreaterThan(0);
            expect(result.pepperfry.length).toBeGreaterThan(0);

            // All fields should be valid URLs
            expect(() => new URL(result.amazon)).not.toThrow();
            expect(() => new URL(result.flipkart)).not.toThrow();
            expect(() => new URL(result.pepperfry)).not.toThrow();

            // URLs should contain the category (encoded)
            const encodedCategory = encodeURIComponent(category);
            expect(result.amazon).toContain(encodedCategory);
            expect(result.flipkart).toContain(encodedCategory);
            expect(result.pepperfry).toContain(encodedCategory);

            // URLs should point to correct domains
            expect(result.amazon).toContain('amazon.in');
            expect(result.flipkart).toContain('flipkart.com');
            expect(result.pepperfry).toContain('pepperfry.com');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: URL generation should be deterministic
     */
    test('should generate identical URLs for the same category', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (category) => {
            const result1 = generateSearchUrls(category);
            const result2 = generateSearchUrls(category);
            const result3 = generateSearchUrls(category);

            // All results should be identical
            expect(result1.amazon).toBe(result2.amazon);
            expect(result2.amazon).toBe(result3.amazon);

            expect(result1.flipkart).toBe(result2.flipkart);
            expect(result2.flipkart).toBe(result3.flipkart);

            expect(result1.pepperfry).toBe(result2.pepperfry);
            expect(result2.pepperfry).toBe(result3.pepperfry);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Special characters should be properly URL encoded
     */
    test('should properly encode special characters in category names', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (category) => {
            const result = generateSearchUrls(category);

            // URLs should be valid even with special characters
            expect(() => new URL(result.amazon)).not.toThrow();
            expect(() => new URL(result.flipkart)).not.toThrow();
            expect(() => new URL(result.pepperfry)).not.toThrow();

            // If category contains spaces or special chars, they should be encoded
            if (category.includes(' ') || category.includes('&') || category.includes('=')) {
              const encodedCategory = encodeURIComponent(category);
              expect(result.amazon).toContain(encodedCategory);
              expect(result.flipkart).toContain(encodedCategory);
              expect(result.pepperfry).toContain(encodedCategory);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Specific Examples', () => {
    test('should generate correct URLs for "Sofa"', () => {
      const result = generateSearchUrls('Sofa');

      expect(result.amazon).toBe('https://www.amazon.in/s?k=Sofa');
      expect(result.flipkart).toBe('https://www.flipkart.com/search?q=Sofa');
      expect(result.pepperfry).toBe('https://www.pepperfry.com/search?q=Sofa');
    });

    test('should generate correct URLs for "Coffee Table"', () => {
      const result = generateSearchUrls('Coffee Table');

      expect(result.amazon).toBe('https://www.amazon.in/s?k=Coffee%20Table');
      expect(result.flipkart).toBe('https://www.flipkart.com/search?q=Coffee%20Table');
      expect(result.pepperfry).toBe('https://www.pepperfry.com/search?q=Coffee%20Table');
    });

    test('should handle special characters', () => {
      const result = generateSearchUrls('Sofa & Chair');

      expect(result.amazon).toContain('Sofa%20%26%20Chair');
      expect(result.flipkart).toContain('Sofa%20%26%20Chair');
      expect(result.pepperfry).toContain('Sofa%20%26%20Chair');
    });

    test('should handle empty-like strings', () => {
      const result = generateSearchUrls(' ');

      // Should still generate valid URLs
      expect(() => new URL(result.amazon)).not.toThrow();
      expect(() => new URL(result.flipkart)).not.toThrow();
      expect(() => new URL(result.pepperfry)).not.toThrow();
    });

    test('should handle long category names', () => {
      const longCategory = 'Very Long Furniture Category Name With Multiple Words';
      const result = generateSearchUrls(longCategory);

      expect(result.amazon).toContain(encodeURIComponent(longCategory));
      expect(result.flipkart).toContain(encodeURIComponent(longCategory));
      expect(result.pepperfry).toContain(encodeURIComponent(longCategory));
    });

    test('should return object with exactly three properties', () => {
      const result = generateSearchUrls('Table');

      const keys = Object.keys(result);
      expect(keys).toHaveLength(3);
      expect(keys).toContain('amazon');
      expect(keys).toContain('flipkart');
      expect(keys).toContain('pepperfry');
    });

    test('should handle numeric category names', () => {
      const result = generateSearchUrls('3-Seater Sofa');

      expect(result.amazon).toContain('3-Seater%20Sofa');
      expect(result.flipkart).toContain('3-Seater%20Sofa');
      expect(result.pepperfry).toContain('3-Seater%20Sofa');
    });

    test('should handle categories with hyphens', () => {
      const result = generateSearchUrls('L-Shaped Sofa');

      expect(result.amazon).toContain('L-Shaped%20Sofa');
      expect(result.flipkart).toContain('L-Shaped%20Sofa');
      expect(result.pepperfry).toContain('L-Shaped%20Sofa');
    });
  });
});
