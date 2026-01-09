'use client';

import React from 'react';
import { VibePreset, IntentInputProps } from '@/types';

/**
 * IntentInput Component
 * 
 * Allows users to provide redesign intent through:
 * 1. Free-form text input
 * 2. Quick vibe preset selection
 * 
 * Requirements: 3.1, 3.2, 3.3
 */
export default function IntentInput({
  value,
  onChange,
  onPresetSelect,
  disabled = false,
}: IntentInputProps) {
  // Define vibe presets with descriptions
  const vibePresets: Array<{ preset: VibePreset; label: string; description: string }> = [
    {
      preset: 'modern',
      label: 'Modern',
      description: 'Clean lines, minimalist furniture, contemporary style',
    },
    {
      preset: 'traditional',
      label: 'Traditional',
      description: 'Classic Indian aesthetics, rich colors, ornate details',
    },
    {
      preset: 'minimalist',
      label: 'Minimalist',
      description: 'Simple, clutter-free, functional spaces',
    },
    {
      preset: 'bohemian',
      label: 'Bohemian',
      description: 'Eclectic, colorful, artistic and relaxed vibe',
    },
  ];

  // Handle preset button click
  const handlePresetClick = (preset: VibePreset, label: string) => {
    // Populate text input with preset value
    onChange(label.toLowerCase());
    // Notify parent of preset selection
    onPresetSelect(preset);
  };

  return (
    <div className="w-full space-y-6">
      {/* Text Input - Requirement 3.1 */}
      <div>
        <label
          htmlFor="intent-input"
          className="block text-sm sm:text-base font-semibold text-stone-800 mb-2 sm:mb-3"
        >
          Describe your redesign vision
        </label>
        <input
          id="intent-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., cozy and warm, bright and airy, elegant and sophisticated..."
          className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-stone-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-600 disabled:bg-stone-100 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="User intent text input"
        />
      </div>

      {/* Vibe Presets - Requirements 3.2, 3.3 */}
      <div>
        <p className="text-sm sm:text-base font-semibold text-stone-800 mb-3 sm:mb-4">
          Or choose a vibe preset:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {vibePresets.map(({ preset, label, description }) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset, label)}
              disabled={disabled}
              className="p-4 sm:p-5 border-2 border-stone-300 rounded-xl hover:border-amber-600 hover:bg-amber-50/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-left group focus:outline-none focus:ring-4 focus:ring-amber-300 transform hover:scale-105"
              aria-label={`Select ${label} preset`}
              data-preset={preset}
            >
              <div className="font-bold text-base sm:text-lg text-stone-900 mb-1 sm:mb-2 group-hover:text-amber-700 transition-colors">
                {label}
              </div>
              <div className="text-xs sm:text-sm text-stone-600 group-hover:text-stone-800 transition-colors leading-relaxed">
                {description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helper text */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Tip:</strong> Be specific about colors, materials, or mood you want to achieve for best results
          </span>
        </p>
      </div>
    </div>
  );
}
