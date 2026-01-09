/**
 * Prompt Optimizer v2.5 for Interior-Dost MVP
 * Converts user intent + room context + target function into optimized prompts
 * Deterministic implementation - no randomness
 * 
 * NEW in v2.5:
 * - DETAILED PROFESSIONAL PROMPTS (inspired by user's successful NanoBanana prompt)
 * - "Act as interior designer" framing for better results
 * - Specific element mentions: AC, wiring, furniture, wall art, lighting
 * - More detailed instructions for premium models like NanoBanana
 * 
 * Key Insight: Premium models (NanoBanana) respond better to detailed, 
 * professional instructions rather than simple prompts
 * 
 * Features from v2.0:
 * - Function-aware transformations (empty room → dining room, bedroom, etc.)
 * - Automatic furniture injection based on target function
 * - Context-aware prompt building
 */

import { UserIntent, RoomContext, OptimizedPrompt, RoomFunction } from '@/types';

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
 * Infer target room function from user intent text
 * Returns null if no function is detected
 */
export function inferTargetFunction(text: string): RoomFunction {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const normalized = text.toLowerCase().trim();

  // Check for dining room keywords
  if (normalized.includes('dining') || normalized.includes('dining room')) {
    return 'dining_room';
  }

  // Check for bedroom keywords
  if (normalized.includes('bedroom') || normalized.includes('bed room')) {
    return 'bedroom';
  }

  // Check for living room keywords
  if (normalized.includes('living') || normalized.includes('living room') || normalized.includes('lounge')) {
    return 'living_room';
  }

  // Check for home office keywords
  if (normalized.includes('office') || normalized.includes('study') || normalized.includes('workspace')) {
    return 'home_office';
  }

  return null;
}

/**
 * Get required furniture for a target room function
 * Returns empty array if no function specified
 */
export function getRequiredFurniture(targetFunction: RoomFunction): string[] {
  if (!targetFunction) {
    return [];
  }

  switch (targetFunction) {
    case 'dining_room':
      return [
        'dining table (4-6 seater)',
        'dining chairs',
        'overhead pendant lighting',
        'sideboard or storage cabinet'
      ];
    
    case 'bedroom':
      return [
        'double bed with headboard',
        'bedside tables',
        'wardrobe or closet',
        'bedside lamps',
        'comfortable rug'
      ];
    
    case 'living_room':
      return [
        'comfortable sofa',
        'coffee table',
        'TV unit or entertainment center',
        'accent chairs',
        'floor lamp',
        'area rug'
      ];
    
    case 'home_office':
      return [
        'work desk',
        'ergonomic office chair',
        'bookshelf or storage',
        'desk lamp',
        'comfortable seating area'
      ];
    
    default:
      return [];
  }
}

/**
 * Build positive prompt from intent, context, and target function
 * v2.5: DETAILED PROFESSIONAL PROMPTS - Act as interior designer
 * INSPIRED BY: User's successful NanoBanana prompt with AC, wiring, furniture details
 * STRATEGY: Detailed, professional instructions like a real interior designer would give
 */
export function buildPositivePrompt(
  styleKeywords: string[],
  context: RoomContext,
  preset?: string,
  targetFunction?: RoomFunction,
  personalPrompt?: string
): string {
  const parts: string[] = [];

  // ============================================================================
  // CRITICAL: GEOMETRY LOCK CONSTRAINTS (MUST BE FIRST!)
  // ============================================================================
  // These constraints MUST appear at the start of the prompt to ensure
  // the AI model preserves the room structure and doesn't hallucinate
  // a completely different room
  parts.push('exact room geometry preserved');
  parts.push('same camera angle');
  parts.push('same room dimensions');
  parts.push('no wall movement');
  parts.push('no window relocation');
  
  // ============================================================================
  // v2.5: PROFESSIONAL INTERIOR DESIGNER APPROACH
  // ============================================================================
  // Based on user's successful prompt: "Change background and add furniture. 
  // also ac and wiring. Act as an interior designer and design it"
  
  // Start with professional framing
  parts.push('Act as a professional interior designer');
  parts.push('redesign this room with attention to detail');
  
  // ============================================================================
  // PERSONAL PROMPT ENHANCEMENT (if provided)
  // ============================================================================
  if (personalPrompt && personalPrompt.trim().length > 0) {
    // User provided a personal prompt - use it with professional enhancement
    console.log('[PromptOptimizer] Enhancing personal prompt:', personalPrompt);
    parts.push(personalPrompt.trim());
  } else {
    // ============================================================================
    // STANDARD ROOM TRANSFORMATION (no personal prompt)
    // ============================================================================
    
    // Add target function if specified
    if (targetFunction) {
      const functionName = targetFunction.replace('_', ' ');
      parts.push(`transform into a ${functionName}`);
      
      // Add required furniture for this function
      const requiredFurniture = getRequiredFurniture(targetFunction);
      if (requiredFurniture.length > 0) {
        parts.push(`add ${requiredFurniture.join(', ')}`);
      }
    } else {
      // Use existing room type
      parts.push(`redesign as ${context.room_type}`);
    }

    // Add style keywords or preset
    if (preset) {
      parts.push(`${preset} style interior design`);
    }
    if (styleKeywords.length > 0) {
      parts.push(`with ${styleKeywords.slice(0, 3).join(', ')} aesthetic`);
    }
  }

  // ============================================================================
  // DETAILED ELEMENTS (like user's successful prompt)
  // ============================================================================
  parts.push('add appropriate furniture placement');
  parts.push('include wall art and decorative elements');
  parts.push('add modern AC unit if needed');
  parts.push('ensure proper lighting fixtures');
  parts.push('add electrical outlets and wiring details');
  parts.push('include window treatments');
  parts.push('add area rugs and textiles');
  parts.push('ensure cohesive color scheme');

  // ============================================================================
  // INDIAN HOME AESTHETIC & RENTAL FRIENDLY (ALWAYS REQUIRED)
  // ============================================================================
  parts.push('Indian home aesthetic');
  parts.push('rental friendly');

  // ============================================================================
  // QUALITY PARAMETERS
  // ============================================================================
  parts.push('photorealistic rendering');
  parts.push('professional interior photography quality');
  parts.push('realistic');
  parts.push('natural lighting');
  parts.push('high resolution');
  parts.push('sharp details');

  return parts.join(', ');
}

/**
 * Build negative prompt to avoid unwanted elements
 * v2.8: STRENGTHENED - Explicitly reject geometry changes and room structure modifications
 */
export function buildNegativePrompt(): string {
  const negativeElements = [
    // CRITICAL: Prevent geometry changes
    'different room layout',
    'moved windows',
    'moved doors',
    'different walls',
    'changed room shape',
    'different perspective',
    'different camera angle',
    'different room dimensions',
    'structural changes',
    'wall movement',
    'window relocation',
    
    // Core quality issues
    'blurry',
    'low quality',
    'distorted',
    'unrealistic',
    'cartoon',
    '3d render',
    'sketch',
    'drawing',
    
    // Avoid construction/demolition scenes
    'construction',
    'demolition',
    'unfinished',
    'under construction',
    'renovation in progress',
    'exposed wiring',
    'bare walls',
    'construction materials',
    
    // Composition issues
    'multiple rooms',
    'split view',
    'collage'
  ];

  return negativeElements.join(', ');
}

/**
 * Main prompt optimization function v2.5+
 * Converts user intent, room context, and target function into optimized prompts
 * Deterministic - same inputs always produce same outputs
 * 
 * NEW in v2.5+:
 * - DETAILED PROFESSIONAL PROMPTS for premium models (NanoBanana)
 * - "Act as interior designer" framing
 * - Specific element mentions: AC, wiring, furniture, wall art, lighting
 * - Optimized for NanoBanana's superior understanding
 * 
 * Key Change: Premium models like NanoBanana respond better to detailed,
 * professional instructions. We now provide comprehensive design guidance.
 * 
 * Features from v2.0:
 * - Automatically infers target function from user text
 * - Injects required furniture for target function
 * - Preserves walls, windows, layout (rental-friendly)
 */
export function optimizePrompt(
  intent: UserIntent,
  context: RoomContext
): OptimizedPrompt {
  // Check if user provided a personal prompt (raw text that should be enhanced)
  const hasPersonalPrompt = intent.text && intent.text.trim().length > 0;
  
  // Handle empty intent - use default Indian home aesthetic
  const effectiveText = hasPersonalPrompt
    ? intent.text
    : 'traditional Indian home';

  // Infer target function from user text (v2 feature)
  // Only infer if no personal prompt (personal prompts are used as-is)
  const targetFunction = intent.targetFunction || 
    (!hasPersonalPrompt ? inferTargetFunction(effectiveText) : null);

  // Extract style keywords from text (only if not a personal prompt)
  const styleKeywords = !hasPersonalPrompt ? extractStyleKeywords(effectiveText) : [];

  // Build positive prompt with function awareness and personal prompt support
  const positive = buildPositivePrompt(
    styleKeywords,
    context,
    intent.preset,
    targetFunction,
    hasPersonalPrompt ? effectiveText : undefined // Pass personal prompt if available
  );

  // Build negative prompt (deterministic, no context needed)
  const negative = buildNegativePrompt();

  // Define applied constraints for transparency
  const constraints = [
    'EXACT room geometry and dimensions preserved',
    'Same camera angle and perspective',
    'No structural changes - walls, windows, doors unchanged',
    'Indian home aesthetic',
    'Rental friendly',
    'Photorealistic quality'
  ];

  // Add function-specific constraint if applicable
  if (targetFunction) {
    const functionName = targetFunction.replace('_', ' ');
    constraints.push(`Transform to ${functionName} with appropriate furniture`);
  }

  // Add personal prompt indicator if applicable
  if (hasPersonalPrompt) {
    constraints.push('Personal prompt enhanced with room preservation');
  }

  return {
    positive,
    negative,
    metadata: {
      room_type: context.room_type,
      target_function: targetFunction,
      constraints
    }
  };
}
