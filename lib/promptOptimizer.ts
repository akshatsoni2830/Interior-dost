/**
 * Prompt Optimizer for Interior-Dost MVP
 * Converts user intent + room context into optimized SDXL prompts
 * Deterministic implementation - no randomness
 */

import { UserIntent, RoomContext, OptimizedPrompt } from '@/types';

/**
 * Extract style keywords from user text input
 * Removes common words and returns meaningful style descriptors
 */
export function extractStyleKeywords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize text: lowercase and remove extra spaces
  const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');

  // Common words to filter out
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'i', 'you',
    'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its',
    'our', 'their', 'this', 'that', 'these', 'those', 'want', 'like',
    'make', 'look', 'feel', 'room', 'space', 'design', 'interior'
  ]);

  // Split into words and filter
  const words = normalized.split(' ').filter(word => {
    return word.length > 2 && !stopWords.has(word);
  });

  // Remove duplicates while preserving order
  return Array.from(new Set(words));
}

/**
 * Build positive prompt from intent and context
 */
export function buildPositivePrompt(
  styleKeywords: string[],
  context: RoomContext,
  preset?: string
): string {
  const parts: string[] = [];

  // Add style keywords or preset
  if (preset) {
    parts.push(preset);
  }
  if (styleKeywords.length > 0) {
    parts.push(styleKeywords.join(' '));
  }

  // Add room type
  parts.push(`${context.room_type} interior`);

  // Add context details
  if (context.wall_color && context.wall_color !== 'unknown') {
    parts.push(`${context.wall_color} walls`);
  }

  if (context.lighting_type && context.lighting_type !== 'unknown') {
    parts.push(`${context.lighting_type} lighting`);
  }

  // Add visible objects if available (limit to first 3 for prompt brevity)
  if (context.visible_objects && context.visible_objects.length > 0) {
    const objects = context.visible_objects.slice(0, 3).join(', ');
    parts.push(`with ${objects}`);
  }

  // Add mandatory constraints
  parts.push('Indian home aesthetic');
  parts.push('rental friendly');
  parts.push('realistic photography');
  parts.push('4k');
  parts.push('high quality');

  return parts.join(', ');
}

/**
 * Build negative prompt to avoid unwanted elements
 */
export function buildNegativePrompt(): string {
  const negativeElements = [
    'structural changes',
    'demolition',
    'construction',
    'unrealistic',
    'cartoon',
    '3d render',
    'multiple rooms',
    'dark',
    'cluttered',
    'messy',
    'low quality',
    'blurry',
    'distorted'
  ];

  return negativeElements.join(', ');
}

/**
 * Main prompt optimization function
 * Converts user intent and room context into optimized SDXL prompts
 * Deterministic - same inputs always produce same outputs
 */
export function optimizePrompt(
  intent: UserIntent,
  context: RoomContext
): OptimizedPrompt {
  // Handle empty intent - use default Indian home aesthetic
  const effectiveText = intent.text && intent.text.trim().length > 0
    ? intent.text
    : 'traditional Indian home';

  // Extract style keywords from text
  const styleKeywords = extractStyleKeywords(effectiveText);

  // Build positive prompt
  const positive = buildPositivePrompt(
    styleKeywords,
    context,
    intent.preset
  );

  // Build negative prompt (deterministic, no context needed)
  const negative = buildNegativePrompt();

  // Define applied constraints for transparency
  const constraints = [
    'Indian home aesthetic',
    'rental friendly, no structural changes',
    'realistic, photorealistic',
    'preserve room layout and architecture'
  ];

  return {
    positive,
    negative,
    metadata: {
      room_type: context.room_type,
      constraints
    }
  };
}
