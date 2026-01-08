/**
 * Property-based tests for environment variable loading
 * Feature: interior-dost-mvp, Property 13: Environment Variable Loading
 * Validates: Requirements 7.1
 */

import * as fc from 'fast-check';
import { loadConfig, getApiKey, validateEnvironment } from '@/lib/config';

describe('Environment Variable Loading', () => {
  // Store original env to restore after tests
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('Property 13: Environment Variable Loading', () => {
    /**
     * Property: For any required API key, the system should load it from process.env
     * and not from hardcoded values
     */
    test('should load all API keys from process.env', () => {
      fc.assert(
        fc.property(
          fc.record({
            replicateToken: fc.string({ minLength: 10, maxLength: 100 }),
            geminiKey: fc.string({ minLength: 10, maxLength: 100 }),
            provider: fc.constantFrom('gemini' as const, 'openai' as const),
          }),
          (config) => {
            // Set environment variables
            process.env.REPLICATE_API_TOKEN = config.replicateToken;
            process.env.VISION_PROVIDER = config.provider;
            
            if (config.provider === 'gemini') {
              process.env.GEMINI_API_KEY = config.geminiKey;
              delete process.env.OPENAI_API_KEY;
            } else {
              process.env.OPENAI_API_KEY = config.geminiKey;
              delete process.env.GEMINI_API_KEY;
            }

            // Load config
            const loadedConfig = loadConfig();

            // Verify all values come from process.env
            expect(loadedConfig.replicateApiToken).toBe(config.replicateToken);
            expect(loadedConfig.visionProvider).toBe(config.provider);
            
            if (config.provider === 'gemini') {
              expect(loadedConfig.geminiApiKey).toBe(config.geminiKey);
            } else {
              expect(loadedConfig.openaiApiKey).toBe(config.geminiKey);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: getApiKey should always return the value from process.env
     */
    test('getApiKey should retrieve values from process.env', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (keyName, keyValue) => {
            // Set environment variable
            process.env[keyName] = keyValue;

            // Get API key
            const retrievedValue = getApiKey(keyName);

            // Should match process.env value
            expect(retrievedValue).toBe(keyValue);
            expect(retrievedValue).toBe(process.env[keyName]);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any missing required API key, loadConfig should throw an error
     */
    test('should throw error when required API keys are missing', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('gemini' as const, 'openai' as const),
          (provider) => {
            // Clear all API keys
            delete process.env.REPLICATE_API_TOKEN;
            delete process.env.GEMINI_API_KEY;
            delete process.env.OPENAI_API_KEY;
            process.env.VISION_PROVIDER = provider;

            // Should throw error
            expect(() => loadConfig()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: validateEnvironment should return valid=false when required keys are missing
     */
    test('validateEnvironment should detect missing required keys', () => {
      fc.assert(
        fc.property(
          fc.record({
            hasReplicate: fc.boolean(),
            hasVisionKey: fc.boolean(),
            provider: fc.constantFrom('gemini' as const, 'openai' as const),
          }),
          (config) => {
            // Set up environment based on config
            if (config.hasReplicate) {
              process.env.REPLICATE_API_TOKEN = 'test-token';
            } else {
              delete process.env.REPLICATE_API_TOKEN;
            }

            process.env.VISION_PROVIDER = config.provider;

            if (config.hasVisionKey) {
              if (config.provider === 'gemini') {
                process.env.GEMINI_API_KEY = 'test-key';
                delete process.env.OPENAI_API_KEY;
              } else {
                process.env.OPENAI_API_KEY = 'test-key';
                delete process.env.GEMINI_API_KEY;
              }
            } else {
              delete process.env.GEMINI_API_KEY;
              delete process.env.OPENAI_API_KEY;
            }

            const result = validateEnvironment();

            // Should be valid only if all required keys are present
            const shouldBeValid = config.hasReplicate && config.hasVisionKey;
            expect(result.valid).toBe(shouldBeValid);

            // If invalid, should have error messages
            if (!shouldBeValid) {
              expect(result.errors.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Specific Examples', () => {
    test('should load config with Gemini provider', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.VISION_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-gemini-key';

      const config = loadConfig();

      expect(config.replicateApiToken).toBe('test-replicate-token');
      expect(config.visionProvider).toBe('gemini');
      expect(config.geminiApiKey).toBe('test-gemini-key');
    });

    test('should load config with OpenAI provider', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.VISION_PROVIDER = 'openai';
      process.env.OPENAI_API_KEY = 'test-openai-key';

      const config = loadConfig();

      expect(config.replicateApiToken).toBe('test-replicate-token');
      expect(config.visionProvider).toBe('openai');
      expect(config.openaiApiKey).toBe('test-openai-key');
    });

    test('should default to gemini provider if not specified', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.GEMINI_API_KEY = 'test-gemini-key';
      delete process.env.VISION_PROVIDER;

      const config = loadConfig();

      expect(config.visionProvider).toBe('gemini');
    });

    test('should throw error when REPLICATE_API_TOKEN is missing', () => {
      delete process.env.REPLICATE_API_TOKEN;
      process.env.GEMINI_API_KEY = 'test-gemini-key';

      expect(() => loadConfig()).toThrow('Missing required environment variable: REPLICATE_API_TOKEN');
    });

    test('should throw error when GEMINI_API_KEY is missing for gemini provider', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.VISION_PROVIDER = 'gemini';
      delete process.env.GEMINI_API_KEY;

      expect(() => loadConfig()).toThrow('Missing required environment variable: GEMINI_API_KEY');
    });

    test('should throw error when OPENAI_API_KEY is missing for openai provider', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.VISION_PROVIDER = 'openai';
      delete process.env.OPENAI_API_KEY;

      expect(() => loadConfig()).toThrow('Missing required environment variable: OPENAI_API_KEY');
    });

    test('should handle demo mode flag', () => {
      process.env.REPLICATE_API_TOKEN = 'test-replicate-token';
      process.env.GEMINI_API_KEY = 'test-gemini-key';
      process.env.DEMO_MODE = 'true';

      const config = loadConfig();

      expect(config.demoMode).toBe(true);
    });

    test('getApiKey should return undefined for non-existent keys', () => {
      const result = getApiKey('NON_EXISTENT_KEY_12345');
      expect(result).toBeUndefined();
    });
  });
});
