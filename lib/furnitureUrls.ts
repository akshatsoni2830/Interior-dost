/**
 * Furniture URL Generator
 * Generates search URLs for furniture categories across Indian e-commerce platforms
 */

import { SearchUrls } from '@/types';

/**
 * Generates search URLs for a furniture category across multiple platforms
 * @param category - The furniture category to search for (e.g., "Sofa", "Coffee Table")
 * @returns Object containing search URLs for Amazon, Flipkart, and Pepperfry
 */
export function generateSearchUrls(category: string): SearchUrls {
  // Encode the category for URL safety
  const encodedCategory = encodeURIComponent(category);

  return {
    amazon: `https://www.amazon.in/s?k=${encodedCategory}`,
    flipkart: `https://www.flipkart.com/search?q=${encodedCategory}`,
    pepperfry: `https://www.pepperfry.com/search?q=${encodedCategory}`,
  };
}
