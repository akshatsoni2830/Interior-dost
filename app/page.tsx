/**
 * Main Application Page - Interior-Dost MVP
 * 
 * Orchestrates the full pipeline:
 * 1. Image upload
 * 2. Room analysis
 * 3. User intent capture
 * 4. Image generation
 * 5. Furniture suggestions
 * 
 * Requirements: 1.4, 2.4, 3.3, 4.5, 5.5, 6.4
 */

'use client';

import React, { useState } from 'react';
import UploadComponent from '@/components/UploadComponent';
import IntentInput from '@/components/IntentInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import { RoomContext, FurnitureCategory, VibePreset } from '@/types';

export default function Home() {
  // State management for uploaded image
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // State management for room context
  const [roomContext, setRoomContext] = useState<RoomContext | null>(null);

  // State management for user intent
  const [userIntent, setUserIntent] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<VibePreset | undefined>(undefined);

  // State management for redesigned image
  const [redesignedImageUrl, setRedesignedImageUrl] = useState<string | null>(null);

  // State management for furniture categories
  const [furnitureCategories, setFurnitureCategories] = useState<FurnitureCategory[]>([]);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetectingFurniture, setIsDetectingFurniture] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'warning' | 'error'>('error');

  // Handle image selection from Upload Component
  const handleImageSelected = (file: File, previewUrl: string) => {
    setUploadedFile(file);
    setUploadedImageUrl(previewUrl);
    // Clear previous results
    setRoomContext(null);
    setRedesignedImageUrl(null);
    setFurnitureCategories([]);
    setError(null);
  };

  // Handle user intent change
  const handleIntentChange = (value: string) => {
    setUserIntent(value);
  };

  // Handle preset selection
  const handlePresetSelect = (preset: VibePreset) => {
    setSelectedPreset(preset);
  };

  // Main redesign handler - orchestrates the full pipeline
  const handleRedesign = async () => {
    if (!uploadedFile || !uploadedImageUrl) {
      setError('Please upload an image first');
      setErrorType('error');
      return;
    }

    // Clear previous errors
    setError(null);

    try {
      // Step 1: Analyze room
      setIsAnalyzing(true);
      const roomContextResult = await analyzeRoom(uploadedImageUrl);
      setRoomContext(roomContextResult);
      setIsAnalyzing(false);

      // Step 2: Generate redesigned image
      setIsGenerating(true);
      const generatedImageUrl = await generateImage(uploadedImageUrl, userIntent, roomContextResult);
      setRedesignedImageUrl(generatedImageUrl);
      setIsGenerating(false);

      // Step 3: Detect furniture in generated image
      setIsDetectingFurniture(true);
      const furnitureResult = await detectFurniture(generatedImageUrl);
      setFurnitureCategories(furnitureResult);
      setIsDetectingFurniture(false);

    } catch (err) {
      // Handle errors at each step
      setIsAnalyzing(false);
      setIsGenerating(false);
      setIsDetectingFurniture(false);
      
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setErrorType('error');
    }
  };

  // Call /api/analyze-room with uploaded image
  const analyzeRoom = async (imageBase64: string): Promise<RoomContext> => {
    const response = await fetch('/api/analyze-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64 }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to analyze room');
    }

    return data.data;
  };

  // Call /api/generate-image with merged data
  const generateImage = async (
    imageBase64: string,
    intent: string,
    context: RoomContext
  ): Promise<string> => {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        controlImage: imageBase64,
        userIntent: { text: intent, preset: selectedPreset },
        roomContext: context,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate image');
    }

    return data.imageUrl || data.data;
  };

  // Call /api/detect-furniture with generated image
  const detectFurniture = async (imageUrl: string): Promise<FurnitureCategory[]> => {
    // Convert image URL to base64 for API call
    const imageBase64 = await urlToBase64(imageUrl);

    const response = await fetch('/api/detect-furniture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64 }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to detect furniture');
    }

    return data.data;
  };

  // Helper function to convert URL to base64
  const urlToBase64 = async (url: string): Promise<string> => {
    // If it's already a data URL, return as is
    if (url.startsWith('data:')) {
      return url;
    }

    // Fetch the image and convert to base64
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Retry handler for errors
  const handleRetry = () => {
    setError(null);
    handleRedesign();
  };

  // Check if we're loading
  const isLoading = isAnalyzing || isGenerating || isDetectingFurniture;

  // Check if we have results to display
  const hasResults = redesignedImageUrl && roomContext && furnitureCategories.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 sm:mb-4 leading-tight">
            Interior-Dost
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            AI-powered room redesign for Indian homes. Upload your room, describe your vision, and see the transformation.
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Upload Section */}
          <section 
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl"
            aria-labelledby="upload-heading"
          >
            <h2 
              id="upload-heading"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
            >
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-base sm:text-lg flex-shrink-0">
                1
              </span>
              <span className="leading-tight">Upload Your Room Image</span>
            </h2>
            <UploadComponent
              onImageSelected={handleImageSelected}
              maxSizeMB={10}
              acceptedFormats={['image/jpeg', 'image/png']}
              disabled={isLoading}
            />
          </section>

          {/* Intent Input Section */}
          {uploadedImageUrl && (
            <section 
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl animate-slide-in"
              aria-labelledby="intent-heading"
            >
              <h2 
                id="intent-heading"
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
              >
                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-base sm:text-lg flex-shrink-0">
                  2
                </span>
                <span className="leading-tight">Describe Your Vision</span>
              </h2>
              <IntentInput
                value={userIntent}
                onChange={handleIntentChange}
                onPresetSelect={handlePresetSelect}
                disabled={isLoading}
              />
            </section>
          )}

          {/* Redesign Button */}
          {uploadedImageUrl && (
            <div className="flex justify-center animate-slide-in">
              <button
                onClick={handleRedesign}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base sm:text-lg md:text-xl font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label={isLoading ? 'Processing your redesign request' : 'Start room redesign'}
                aria-busy={isLoading}
                aria-live="polite"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>
                      {isAnalyzing && 'Analyzing room...'}
                      {isGenerating && 'Generating redesign...'}
                      {isDetectingFurniture && 'Finding furniture...'}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span aria-hidden="true">✨</span>
                    <span>Redesign My Room</span>
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <section className="animate-slide-in" role="alert" aria-live="assertive">
              <ErrorDisplay
                type={errorType}
                message={error}
                retryAction={handleRetry}
              />
            </section>
          )}

          {/* Results Display */}
          {hasResults && uploadedImageUrl && (
            <section 
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl animate-slide-in"
              aria-labelledby="results-heading"
            >
              <ResultsDisplay
                originalImage={uploadedImageUrl}
                redesignedImage={redesignedImageUrl}
                roomContext={roomContext}
                furnitureCategories={furnitureCategories}
              />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-600 text-xs sm:text-sm md:text-base space-y-2 px-4">
          <p className="font-medium">
            Powered by AI • Designed for Indian Homes • Rental-Friendly Suggestions
          </p>
          <p className="text-xs text-gray-500">
            Transform your space without breaking the bank or your lease
          </p>
        </footer>
      </div>
    </div>
  );
}
