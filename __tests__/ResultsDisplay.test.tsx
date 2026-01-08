/**
 * Tests for ResultsDisplay Component
 * Property-based tests for Requirements 2.4, 5.5, 6.4
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import ResultsDisplay from '@/components/ResultsDisplay';
import { RoomContext, FurnitureCategory } from '@/types';

// ============================================================================
// Arbitraries (Generators) for Property-Based Testing
// ============================================================================

/**
 * Generator for valid RoomContext objects
 */
const roomContextArbitrary = (): fc.Arbitrary<RoomContext> => {
  return fc.record({
    room_type: fc.oneof(
      fc.constant('living room'),
      fc.constant('bedroom'),
      fc.constant('kitchen'),
      fc.constant('dining room'),
      fc.constant('bathroom'),
      fc.string({ minLength: 1, maxLength: 30 })
    ),
    visible_objects: fc.array(
      fc.string({ minLength: 1, maxLength: 20 }),
      { minLength: 0, maxLength: 15 }
    ),
    wall_color: fc.oneof(
      fc.constant('white'),
      fc.constant('beige'),
      fc.constant('gray'),
      fc.constant('blue'),
      fc.string({ minLength: 1, maxLength: 20 })
    ),
    lighting_type: fc.oneof(
      fc.constant('natural'),
      fc.constant('warm artificial'),
      fc.constant('bright'),
      fc.string({ minLength: 1, maxLength: 30 })
    ),
  });
};

/**
 * Generator for valid FurnitureCategory objects
 */
const furnitureCategoryArbitrary = (): fc.Arbitrary<FurnitureCategory> => {
  return fc.record({
    category: fc.oneof(
      fc.constant('Sofa'),
      fc.constant('Coffee Table'),
      fc.constant('Rug'),
      fc.constant('Lighting'),
      fc.constant('Storage'),
      fc.string({ minLength: 1, maxLength: 30 })
    ),
    searchUrls: fc.record({
      amazon: fc.webUrl(),
      flipkart: fc.webUrl(),
      pepperfry: fc.webUrl(),
    }),
  });
};

/**
 * Generator for image URLs (data URLs or http URLs)
 */
const imageUrlArbitrary = (): fc.Arbitrary<string> => {
  return fc.oneof(
    fc.webUrl({ validSchemes: ['http', 'https'] }),
    fc.constant('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
  );
};

// ============================================================================
// Property 3: Room Context Display Rendering
// Feature: interior-dost-mvp, Property 3: Room Context Display Rendering
// Validates: Requirements 2.4
// ============================================================================

describe('Property 3: Room Context Display Rendering', () => {
  it('should display all RoomContext fields in human-readable format for any valid RoomContext', () => {
    fc.assert(
      fc.property(
        roomContextArbitrary(),
        imageUrlArbitrary(),
        imageUrlArbitrary(),
        fc.array(furnitureCategoryArbitrary(), { minLength: 3, maxLength: 6 }),
        (roomContext, originalImage, redesignedImage, furnitureCategories) => {
          // Render the component
          const { container } = render(
            <ResultsDisplay
              originalImage={originalImage}
              redesignedImage={redesignedImage}
              roomContext={roomContext}
              furnitureCategories={furnitureCategories}
            />
          );

          // Verify all required fields are displayed
          const roomTypeElement = screen.getByTestId('room-type');
          const wallColorElement = screen.getByTestId('wall-color');
          const lightingTypeElement = screen.getByTestId('lighting-type');
          const visibleObjectsCount = screen.getByTestId('visible-objects-count');
          const visibleObjectsList = screen.getByTestId('visible-objects-list');

          // Check that all fields are present in the DOM
          expect(roomTypeElement).toBeInTheDocument();
          expect(wallColorElement).toBeInTheDocument();
          expect(lightingTypeElement).toBeInTheDocument();
          expect(visibleObjectsCount).toBeInTheDocument();
          expect(visibleObjectsList).toBeInTheDocument();

          // Check that the content matches the RoomContext
          expect(roomTypeElement.textContent).toBe(roomContext.room_type);
          expect(wallColorElement.textContent).toBe(roomContext.wall_color);
          expect(lightingTypeElement.textContent).toBe(roomContext.lighting_type);
          expect(visibleObjectsCount.textContent).toContain(roomContext.visible_objects.length.toString());

          // Check that all visible objects are rendered
          roomContext.visible_objects.forEach((obj) => {
            expect(visibleObjectsList.textContent).toContain(obj);
          });

          // Clean up
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 9: Before/After Display Completeness
// Feature: interior-dost-mvp, Property 9: Before/After Display Completeness
// Validates: Requirements 5.5
// ============================================================================

describe('Property 9: Before/After Display Completeness', () => {
  it('should display both original and redesigned images for any successful image generation', () => {
    fc.assert(
      fc.property(
        imageUrlArbitrary(),
        imageUrlArbitrary(),
        roomContextArbitrary(),
        fc.array(furnitureCategoryArbitrary(), { minLength: 3, maxLength: 6 }),
        (originalImage, redesignedImage, roomContext, furnitureCategories) => {
          // Render the component
          const { container } = render(
            <ResultsDisplay
              originalImage={originalImage}
              redesignedImage={redesignedImage}
              roomContext={roomContext}
              furnitureCategories={furnitureCategories}
            />
          );

          // Verify both images are displayed
          const originalImageElement = screen.getByTestId('original-image');
          const redesignedImageElement = screen.getByTestId('redesigned-image');

          // Check that both images are present in the DOM
          expect(originalImageElement).toBeInTheDocument();
          expect(redesignedImageElement).toBeInTheDocument();

          // Check that the src attributes match the provided URLs
          expect(originalImageElement).toHaveAttribute('src', originalImage);
          expect(redesignedImageElement).toHaveAttribute('src', redesignedImage);

          // Check that alt text is present for accessibility
          expect(originalImageElement).toHaveAttribute('alt');
          expect(redesignedImageElement).toHaveAttribute('alt');

          // Clean up
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ============================================================================
// Property 12: Furniture Links Rendered
// Feature: interior-dost-mvp, Property 12: Furniture Links Rendered
// Validates: Requirements 6.4
// ============================================================================

describe('Property 12: Furniture Links Rendered', () => {
  it('should render each furniture category as a clickable element with all shopping links', () => {
    fc.assert(
      fc.property(
        imageUrlArbitrary(),
        imageUrlArbitrary(),
        roomContextArbitrary(),
        fc.array(furnitureCategoryArbitrary(), { minLength: 3, maxLength: 6 }),
        (originalImage, redesignedImage, roomContext, furnitureCategories) => {
          // Render the component
          const { container } = render(
            <ResultsDisplay
              originalImage={originalImage}
              redesignedImage={redesignedImage}
              roomContext={roomContext}
              furnitureCategories={furnitureCategories}
            />
          );

          // Verify all furniture categories are rendered
          const categoryElements = screen.getAllByTestId('furniture-category');
          expect(categoryElements).toHaveLength(furnitureCategories.length);

          // Verify each category has all three shopping links
          const amazonLinks = screen.getAllByTestId('amazon-link');
          const flipkartLinks = screen.getAllByTestId('flipkart-link');
          const pepperfryLinks = screen.getAllByTestId('pepperfry-link');

          expect(amazonLinks).toHaveLength(furnitureCategories.length);
          expect(flipkartLinks).toHaveLength(furnitureCategories.length);
          expect(pepperfryLinks).toHaveLength(furnitureCategories.length);

          // Verify each link is clickable (has href attribute)
          furnitureCategories.forEach((category, index) => {
            expect(amazonLinks[index]).toHaveAttribute('href', category.searchUrls.amazon);
            expect(flipkartLinks[index]).toHaveAttribute('href', category.searchUrls.flipkart);
            expect(pepperfryLinks[index]).toHaveAttribute('href', category.searchUrls.pepperfry);

            // Verify links open in new tab
            expect(amazonLinks[index]).toHaveAttribute('target', '_blank');
            expect(flipkartLinks[index]).toHaveAttribute('target', '_blank');
            expect(pepperfryLinks[index]).toHaveAttribute('target', '_blank');

            // Verify security attributes
            expect(amazonLinks[index]).toHaveAttribute('rel', 'noopener noreferrer');
            expect(flipkartLinks[index]).toHaveAttribute('rel', 'noopener noreferrer');
            expect(pepperfryLinks[index]).toHaveAttribute('rel', 'noopener noreferrer');
          });

          // Verify category names are displayed
          furnitureCategories.forEach((category) => {
            expect(container.textContent).toContain(category.category);
          });

          // Clean up
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
