import * as fc from 'fast-check';
import { optimizePrompt } from '@/lib/promptOptimizer';
import { UserIntent, RoomContext } from '@/types';

const vibePresetArb = fc.constantFrom('modern', 'traditional', 'minimalist', 'bohemian');
const roomTypeArb = fc.constantFrom('living room', 'bedroom', 'kitchen', 'dining room');
const colorArb = fc.constantFrom('white', 'beige', 'light blue', 'cream', 'gray');
const lightingArb = fc.constantFrom('natural', 'warm artificial', 'bright', 'ambient');
const objectsArb = fc.array(
  fc.constantFrom('sofa', 'table', 'chair', 'bed', 'curtains', 'lamp'),
  { minLength: 0, maxLength: 8 }
);

const userIntentArb = fc.record({
  text: fc.oneof(
    fc.constant(''),
    fc.string({ minLength: 1, maxLength: 100 }),
    fc.constantFrom('cozy and warm', 'modern minimalist', 'traditional Indian')
  ),
  preset: fc.option(vibePresetArb, { nil: undefined }),
});

const roomContextArb = fc.record({
  room_type: roomTypeArb,
  visible_objects: objectsArb,
  wall_color: colorArb,
  lighting_type: lightingArb,
});

describe('Prompt Optimizer', () => {
  test('Property 7: Determinism', () => {
    fc.assert(
      fc.property(
        userIntentArb,
        roomContextArb,
        (intent: UserIntent, context: RoomContext) => {
          const result1 = optimizePrompt(intent, context);
          const result2 = optimizePrompt(intent, context);
          expect(result1.positive).toBe(result2.positive);
          expect(result1.negative).toBe(result2.negative);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Structured Output', () => {
    fc.assert(
      fc.property(
        userIntentArb,
        roomContextArb,
        (intent: UserIntent, context: RoomContext) => {
          const result = optimizePrompt(intent, context);
          expect(result).toHaveProperty('positive');
          expect(result).toHaveProperty('negative');
          expect(result).toHaveProperty('metadata');
          expect(typeof result.positive).toBe('string');
          expect(result.positive.length).toBeGreaterThan(0);
          expect(typeof result.negative).toBe('string');
          expect(result.negative.length).toBeGreaterThan(0);
          expect(result.metadata).toHaveProperty('room_type');
          expect(result.metadata).toHaveProperty('constraints');
          expect(Array.isArray(result.metadata.constraints)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6: Required Constraints', () => {
    fc.assert(
      fc.property(
        userIntentArb,
        roomContextArb,
        (intent: UserIntent, context: RoomContext) => {
          const result = optimizePrompt(intent, context);
          const positiveLower = result.positive.toLowerCase();
          expect(
            positiveLower.includes('indian home') || positiveLower.includes('indian aesthetic')
          ).toBe(true);
          expect(positiveLower.includes('rental friendly')).toBe(true);
          expect(positiveLower.includes('realistic')).toBe(true);
          const negativeLower = result.negative.toLowerCase();
          expect(negativeLower.includes('structural changes')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6.1: Geometry Lock Constraints (v2.1)', () => {
    fc.assert(
      fc.property(
        userIntentArb,
        roomContextArb,
        (intent: UserIntent, context: RoomContext) => {
          const result = optimizePrompt(intent, context);
          const positiveLower = result.positive.toLowerCase();
          
          // CRITICAL: Verify geometry lock constraints are present (v2.1)
          expect(positiveLower.includes('exact room geometry preserved')).toBe(true);
          expect(positiveLower.includes('same camera angle')).toBe(true);
          expect(positiveLower.includes('same room dimensions')).toBe(true);
          expect(positiveLower.includes('no wall movement')).toBe(true);
          expect(positiveLower.includes('no window relocation')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  describe('Unit Tests - Edge Cases', () => {
    test('should use default Indian home aesthetic for empty intent', () => {
      const emptyIntent: UserIntent = { text: '' };
      const context: RoomContext = {
        room_type: 'living room',
        visible_objects: ['sofa', 'table'],
        wall_color: 'white',
        lighting_type: 'natural',
      };
      const result = optimizePrompt(emptyIntent, context);
      expect(result.positive.length).toBeGreaterThan(0);
      expect(result.negative.length).toBeGreaterThan(0);
      const positiveLower = result.positive.toLowerCase();
      expect(
        positiveLower.includes('indian home') ||
          positiveLower.includes('indian aesthetic') ||
          positiveLower.includes('traditional indian')
      ).toBe(true);
    });

    test('should use default for whitespace-only intent', () => {
      const whitespaceIntent: UserIntent = { text: '   \t\n  ' };
      const context: RoomContext = {
        room_type: 'bedroom',
        visible_objects: [],
        wall_color: 'beige',
        lighting_type: 'warm artificial',
      };
      const result = optimizePrompt(whitespaceIntent, context);
      expect(result.positive.length).toBeGreaterThan(0);
      const positiveLower = result.positive.toLowerCase();
      expect(
        positiveLower.includes('indian home') ||
          positiveLower.includes('indian aesthetic') ||
          positiveLower.includes('traditional indian')
      ).toBe(true);
    });
  });
});
