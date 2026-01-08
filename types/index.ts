/**
 * Core TypeScript type definitions for Interior-Dost MVP
 * All interfaces used across the application
 */

// ============================================================================
// Room Analysis Types
// ============================================================================

/**
 * Structured context about a room from Vision AI analysis
 */
export interface RoomContext {
  room_type: string;          // e.g., "living room", "bedroom", "kitchen"
  visible_objects: string[];  // e.g., ["sofa", "coffee table", "curtains"]
  wall_color: string;         // e.g., "white", "beige", "light blue"
  lighting_type: string;      // e.g., "natural", "warm artificial", "bright"
}

// ============================================================================
// User Input Types
// ============================================================================

/**
 * Vibe presets for quick style selection
 */
export type VibePreset = 'modern' | 'traditional' | 'minimalist' | 'bohemian';

/**
 * User's redesign intent - either free text or preset
 */
export interface UserIntent {
  text: string;               // Free-form user input
  preset?: VibePreset;        // Optional quick selection
}

// ============================================================================
// Prompt Optimization Types
// ============================================================================

/**
 * Optimized prompts for SDXL image generation
 */
export interface OptimizedPrompt {
  positive: string;           // Full SDXL positive prompt
  negative: string;           // Full SDXL negative prompt
  metadata: {
    room_type: string;
    constraints: string[];    // Applied constraints for transparency
  };
}

// ============================================================================
// Image Generation Types
// ============================================================================

/**
 * ControlNet type for image generation
 */
export type ControlNetType = 'canny' | 'depth';

/**
 * Configuration for image generation via Replicate
 */
export interface GenerationConfig {
  prompt: string;             // Positive prompt
  negative_prompt: string;    // Negative prompt
  control_image: string;      // Base64 encoded image
  controlnet_type: ControlNetType;
  num_outputs: 1;             // Always 1 for MVP
}

// ============================================================================
// Furniture Suggestion Types
// ============================================================================

/**
 * Search URLs for furniture shopping platforms
 */
export interface SearchUrls {
  amazon: string;
  flipkart: string;
  pepperfry: string;
}

/**
 * Furniture category with shopping links
 */
export interface FurnitureCategory {
  category: string;           // e.g., "Sofa", "Coffee Table", "Rug"
  searchUrls: SearchUrls;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Vision API analysis response
 */
export type VisionAnalysisResponse = ApiResponse<RoomContext>;

/**
 * Image generation API response
 */
export interface ImageGenerationResponse extends ApiResponse<string> {
  imageUrl?: string;  // Alias for data
}

/**
 * Furniture detection API response
 */
export type FurnitureDetectionResponse = ApiResponse<FurnitureCategory[]>;

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for Upload Component
 */
export interface UploadComponentProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  maxSizeMB: number;
  acceptedFormats: string[];
  disabled?: boolean;
}

/**
 * Props for Intent Input Component
 */
export interface IntentInputProps {
  value: string;
  onChange: (value: string) => void;
  onPresetSelect: (preset: VibePreset) => void;
  disabled?: boolean;
}

/**
 * Props for Results Display Component
 */
export interface ResultsProps {
  originalImage: string;
  redesignedImage: string;
  roomContext: RoomContext;
  furnitureCategories: FurnitureCategory[];
}

/**
 * Props for Error Display Component
 */
export interface ErrorDisplayProps {
  type: 'warning' | 'error';
  message: string;
  retryAction?: () => void;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * File validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Environment validation result
 */
export interface EnvironmentValidation {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// Application State Types
// ============================================================================

/**
 * Loading states for different pipeline stages
 */
export interface LoadingStates {
  analyzing: boolean;
  generating: boolean;
  detectingFurniture: boolean;
}

/**
 * Main application state
 */
export interface AppState {
  // Input
  uploadedFile: File | null;
  uploadedImageUrl: string | null;
  userIntent: UserIntent;
  
  // Analysis
  roomContext: RoomContext | null;
  
  // Generation
  redesignedImageUrl: string | null;
  
  // Furniture
  furnitureCategories: FurnitureCategory[];
  
  // UI State
  loading: LoadingStates;
  error: string | null;
  currentStep: 'upload' | 'analyze' | 'generate' | 'complete';
}
