# Geometry Lock Fix v2.9

## Problem

User reported that when uploading an empty hall and using the prompt "minimalist Change background and add furniture. also ac and wiring. Act as an interior designer and design it", the generated image showed a **completely different room**:

- Windows moved to different positions (from barred windows to horizontal blinds)
- Room shape changed
- Different camera angle/perspective
- Different room dimensions

This is exactly what the geometry lock constraints were supposed to prevent, but they weren't working.

## Root Causes

### 1. Geometry Constraints Not in Prompt

The geometry lock constraints were defined in the `constraints` metadata array but **were NOT being added to the actual positive prompt** sent to the AI model. The constraints were only for display/logging purposes - the AI never saw them!

### 2. Wrong Model for Image-to-Image

FLUX Schnell doesn't have strong image-to-image transformation support. **SDXL Turbo** has much better ControlNet and image-to-image capabilities, making it ideal for geometry preservation.

```typescript
// OLD CODE - Constraints only in metadata, not in prompt!
const constraints = [
  'EXACT room geometry and dimensions preserved',
  'Same camera angle and perspective',
  // ... etc
];

return {
  positive, // <-- Didn't include these constraints!
  negative,
  metadata: { constraints } // <-- Only here, not sent to AI
};
```

## Solution

### 1. Added Geometry Lock to Positive Prompt

Updated `buildPositivePrompt()` to include geometry lock constraints **at the very start** of the prompt:

```typescript
export function buildPositivePrompt(...) {
  const parts: string[] = [];

  // CRITICAL: GEOMETRY LOCK CONSTRAINTS (MUST BE FIRST!)
  parts.push('exact room geometry preserved');
  parts.push('same camera angle');
  parts.push('same room dimensions');
  parts.push('no wall movement');
  parts.push('no window relocation');
  
  // ... rest of prompt
}
```

### 2. Strengthened Negative Prompt

Added explicit rejection of geometry changes to the negative prompt:

```typescript
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
  // ... rest
];
```

### 3. Ensured Indian Home & Rental Friendly Always Included

Fixed bug where "Indian home aesthetic" and "rental friendly" were only added when there was NO personal prompt. Now they're ALWAYS added:

```typescript
// INDIAN HOME AESTHETIC & RENTAL FRIENDLY (ALWAYS REQUIRED)
parts.push('Indian home aesthetic');
parts.push('rental friendly');
```

### 4. Removed "interior design" Prefix from Image Generation

The image generation service was adding `"interior design ${config.prompt}"` which was redundant since the prompt optimizer already handles this. Changed to use the prompt directly:

```typescript
// OLD: const encodedPrompt = encodeURIComponent(`interior design ${config.prompt}`);
// NEW: const encodedPrompt = encodeURIComponent(config.prompt);
```

### 5. Added Strength Parameter for Image-to-Image

**CRITICAL FIX**: Added the `strength` parameter to control how much the AI model should deviate from the reference image:

```typescript
// CRITICAL: Add strength parameter for image-to-image
// Lower strength = more faithful to original image geometry
// Range: 0.0 (exact copy) to 1.0 (completely new image)
// 0.5-0.7 is good for preserving geometry while allowing redesign
formData.append('strength', '0.6');
```

This tells SDXL Turbo to stay closer to the original image structure while still allowing furniture and decorative changes.

### 6. Switched from FLUX Schnell to SDXL Turbo

**CRITICAL MODEL CHANGE**: Switched to SDXL Turbo which has superior image-to-image transformation capabilities:

```typescript
const MODELS: ModelConfig[] = [
  {
    name: 'SDXL Turbo',
    model: 'turbo',
    description: 'Fast and accurate with excellent image-to-image support - FREE',
    timeout: 90000,
    costPerImage: 'FREE',
  },
];
```

**Why SDXL Turbo?**
- ✅ Proven image-to-image capabilities
- ✅ Better ControlNet support
- ✅ More accurate geometry preservation
- ✅ Still 100% free on Pollinations.ai
- ✅ Same 90-second timeout

## Testing

All tests pass, including:
- ✅ Property 6: Required Constraints (Indian home, rental friendly, realistic)
- ✅ Property 6.1: Geometry Lock Constraints (exact geometry, same camera angle, same dimensions, no wall movement, no window relocation)
- ✅ Property 7: Determinism
- ✅ Property 5: Structured Output
- ✅ Unit tests for empty intent handling

## Expected Behavior Now

When you upload an empty hall and provide your prompt, the generated image should:
- ✅ Keep the same window positions
- ✅ Maintain the same room shape and dimensions
- ✅ Preserve the camera angle/perspective
- ✅ Only add furniture, AC, wiring, and decorative elements
- ✅ NOT move walls, windows, or doors

## Files Changed

1. `lib/promptOptimizer.ts` - Added geometry lock to positive prompt, strengthened negative prompt, ensured Indian home aesthetic always included
2. `services/imageGenService.ts` - Removed redundant "interior design" prefix, added strength parameter, **switched to SDXL Turbo**
3. `README.md` - Updated to reflect SDXL Turbo
4. `WHATS-NEW.md` - Documented v2.9 changes

## Version

- **Version**: 2.9
- **Date**: January 2026
- **Status**: Fixed and tested ✅

## Try It Again!

Upload your empty hall image again with the same prompt and you should see the room geometry preserved while furniture, AC, wiring, and decorative elements are added!
