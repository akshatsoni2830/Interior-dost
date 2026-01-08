/**
 * Configuration module for loading and validating environment variables
 * Ensures all required API keys are loaded from process.env
 */

export interface AppConfig {
  replicateApiToken: string;
  visionProvider: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiApiKey?: string;
  demoMode: boolean;
}

/**
 * Load configuration from environment variables
 * Throws error if required variables are missing
 */
export function loadConfig(): AppConfig {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  const visionProvider = (process.env.VISION_PROVIDER || 'gemini') as 'gemini' | 'openai';
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const demoMode = process.env.DEMO_MODE === 'true';

  // Validate required variables
  if (!replicateApiToken) {
    throw new Error('Missing required environment variable: REPLICATE_API_TOKEN');
  }

  if (visionProvider === 'gemini' && !geminiApiKey) {
    throw new Error('Missing required environment variable: GEMINI_API_KEY (required when VISION_PROVIDER=gemini)');
  }

  if (visionProvider === 'openai' && !openaiApiKey) {
    throw new Error('Missing required environment variable: OPENAI_API_KEY (required when VISION_PROVIDER=openai)');
  }

  return {
    replicateApiToken,
    visionProvider,
    geminiApiKey,
    openaiApiKey,
    demoMode,
  };
}

/**
 * Get a specific API key from environment variables
 * Returns undefined if not set (does not throw)
 */
export function getApiKey(keyName: string): string | undefined {
  return process.env[keyName];
}

/**
 * Check if all required environment variables are set
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.REPLICATE_API_TOKEN) {
    errors.push('REPLICATE_API_TOKEN is required');
  }

  const visionProvider = process.env.VISION_PROVIDER || 'gemini';
  
  if (visionProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
    errors.push('GEMINI_API_KEY is required when VISION_PROVIDER=gemini');
  }

  if (visionProvider === 'openai' && !process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is required when VISION_PROVIDER=openai');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
