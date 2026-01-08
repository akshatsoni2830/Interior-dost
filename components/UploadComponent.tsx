/**
 * Upload Component for room image selection
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

'use client';

import React, { useRef, useState } from 'react';
import { validateImageFile } from '@/lib/validation';

export interface UploadComponentProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  maxSizeMB: number;
  acceptedFormats: string[];
  disabled?: boolean;
}

export default function UploadComponent({
  onImageSelected,
  maxSizeMB,
  acceptedFormats,
  disabled = false,
}: UploadComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Clear previous error and preview
    setError(null);
    setPreviewUrl(null);

    const files = event.target.files;
    
    // Requirement 1.2: Prevent multiple uploads
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Requirement 1.1, 1.3: Validate file type and size
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Requirement 1.4: Generate preview URL using FileReader
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPreviewUrl(result);
        onImageSelected(file, result);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* File Input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          data-testid="file-input"
          aria-label="Upload room image"
          // Requirement 1.2: Prevent multiple file selection
          multiple={false}
        />

        {/* Upload Button/Area */}
        {!previewUrl && (
          <div
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Click to upload room image"
            className={`
              border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                : 'hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300'
              }
              ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            data-testid="upload-area"
          >
            <div className="space-y-3">
              <svg
                className={`mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 transition-colors duration-300 ${
                  disabled ? 'text-gray-400' : 'text-blue-500'
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm sm:text-base text-gray-700">
                <span className="font-bold text-blue-600 hover:text-blue-700">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                {acceptedFormats.map(f => f.replace('image/', '').toUpperCase()).join(', ')} up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        {/* Error Display - Requirement: Display errors inline */}
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 sm:px-5 py-3 sm:py-4 rounded-lg shadow-sm animate-shake"
            role="alert"
            aria-live="assertive"
            data-testid="error-message"
          >
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Preview Display - Requirement 1.4 */}
        {previewUrl && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden border-2 border-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={previewUrl}
                alt="Preview of uploaded room"
                className="w-full h-auto"
                data-testid="image-preview"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                ✓ Uploaded
              </div>
            </div>
            <button
              onClick={handleClear}
              disabled={disabled}
              className="w-full px-4 sm:px-5 py-3 bg-gray-200 text-gray-800 font-medium text-sm sm:text-base rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              data-testid="clear-button"
              aria-label="Clear uploaded image and upload a different one"
            >
              Clear and Upload Different Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
