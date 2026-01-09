/**
 * Configuration module for loading and validating environment variables
 * Ensures all required API keys are loaded from process.env
 */

export interface AppConfig {
  pollinationsApiKey?: string;
  geminiApiKey?: string;
  visionProvider: 'gemini' | 'openai';
  openaiApiKey?: string;
  demoMode: boolean;
}

/**
 * Load configuration from environment variables
 * Throws error if required variables are missing
 */
export function loadConfig(): AppConfig {
  const visionProvider = (process.env.VISION_PROVIDER || 'gemini') as 'gemini' | 'openai';
  const pollinationsApiKey = process.env.POLLINATIONS_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const demoMode = process.env.DEMO_MODE === 'true';

  // Validate required variables based on providers
  if (visionProvider === 'gemini' && !geminiApiKey) {
    throw new Error('Missing required environment variable: GEMINI_API_KEY (required when VISION_PROVIDER=gemini)');
  }

  if (visionProvider === 'openai' && !openaiApiKey) {
    throw new Error('Missing required environment variable: OPENAI_API_KEY (required when VISION_PROVIDER=openai)');
  }

  return {
    pollinationsApiKey,
    geminiApiKey,
    visionProvider,
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

  const visionProvider = process.env.VISION_PROVIDER || 'gemini';
  
  if (visionProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
    errors.push('GEMINI_API_KEY is required when VISION_PROVIDER=gemini');
  }

  if (visionProvider === 'openai' && !process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is required when VISION_PROVIDER=openai');
  }

  // Pollinations API key is optional - app works without it
  if (!process.env.POLLINATIONS_API_KEY) {
    console.warn('[Config] POLLINATIONS_API_KEY not set - using free tier (works but with basic features)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
