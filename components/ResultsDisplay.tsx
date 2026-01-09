/**
 * Results Display Component
 * Shows before/after images, room context, and furniture suggestions
 * Requirements: 2.4, 5.5, 6.4
 */

'use client';

import React from 'react';
import { RoomContext, FurnitureCategory } from '@/types';

export interface ResultsDisplayProps {
  originalImage: string;
  redesignedImage: string;
  roomContext: RoomContext;
  furnitureCategories: FurnitureCategory[];
}

export default function ResultsDisplay({
  originalImage,
  redesignedImage,
  roomContext,
  furnitureCategories,
}: ResultsDisplayProps) {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {/* Before/After Images - Requirement 5.5 */}
      <div className="space-y-4 sm:space-y-6">
        <h2 
          id="results-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 flex items-center gap-2 sm:gap-3"
        >
          <span className="text-3xl sm:text-4xl" aria-hidden="true">✨</span>
          <span>Your Redesigned Room</span>
        </h2>
        
        {/* Responsive side-by-side layout (stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Original Image */}
          <div className="space-y-2 sm:space-y-3 animate-fade-in">
            <h3 className="text-lg sm:text-xl font-bold text-stone-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-stone-500 rounded-full" aria-hidden="true"></span>
              <span>Before</span>
            </h3>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-stone-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src={originalImage}
                alt="Original room before redesign"
                className="w-full h-auto"
                data-testid="original-image"
              />
            </div>
          </div>

          {/* Redesigned Image */}
          <div className="space-y-2 sm:space-y-3 animate-fade-in animation-delay-200">
            <h3 className="text-lg sm:text-xl font-bold text-amber-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" aria-hidden="true"></span>
              <span>After</span>
            </h3>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-amber-600 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src={redesignedImage}
                alt="Redesigned room after AI transformation"
                className="w-full h-auto"
                data-testid="redesigned-image"
              />
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                AI Generated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Context Display - Requirement 2.4 */}
      <div className="space-y-4 sm:space-y-6 animate-fade-in animation-delay-400">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🔍</span>
          <span>Room Analysis</span>
        </h2>
        
        {/* Display Room_Context as formatted cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Room Type Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-xs sm:text-sm font-semibold text-amber-700 mb-1 sm:mb-2 uppercase tracking-wide">Room Type</div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 capitalize" data-testid="room-type">
              {roomContext.room_type}
            </div>
          </div>

          {/* Wall Color Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-xs sm:text-sm font-semibold text-orange-700 mb-1 sm:mb-2 uppercase tracking-wide">Wall Color</div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 capitalize" data-testid="wall-color">
              {roomContext.wall_color}
            </div>
          </div>

          {/* Lighting Type Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-xs sm:text-sm font-semibold text-yellow-700 mb-1 sm:mb-2 uppercase tracking-wide">Lighting</div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 capitalize" data-testid="lighting-type">
              {roomContext.lighting_type}
            </div>
          </div>

          {/* Visible Objects Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-xs sm:text-sm font-semibold text-green-700 mb-1 sm:mb-2 uppercase tracking-wide">Objects Detected</div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900" data-testid="visible-objects-count">
              {roomContext.visible_objects.length} items
            </div>
          </div>
        </div>

        {/* Visible Objects List */}
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-200 rounded-xl p-4 sm:p-6 shadow-md">
          <div className="text-sm sm:text-base font-bold text-stone-800 mb-3 sm:mb-4">Detected Objects:</div>
          <div className="flex flex-wrap gap-2 sm:gap-3" data-testid="visible-objects-list">
            {roomContext.visible_objects.map((obj, index) => (
              <span
                key={index}
                className="inline-block bg-amber-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md hover:bg-amber-700 transition-all duration-300"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Furniture Categories - Requirement 6.4 */}
      <div className="space-y-4 sm:space-y-6 animate-fade-in animation-delay-600">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🛋️</span>
          <span>Shop Similar Furniture</span>
        </h2>
        <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
          Find furniture to recreate this look from popular Indian retailers:
        </p>

        {/* Render furniture categories as clickable buttons/links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {furnitureCategories.map((item, index) => (
            <div
              key={index}
              className="bg-white border-2 border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              data-testid="furniture-category"
            >
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-4 sm:mb-5 flex items-center gap-2">
                <span className="text-xl sm:text-2xl" aria-hidden="true">📦</span>
                <span>{item.category}</span>
              </h3>
              
              {/* Shopping links */}
              <div className="space-y-2 sm:space-y-3">
                <a
                  href={item.searchUrls.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center text-sm sm:text-base font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
                  data-testid="amazon-link"
                  aria-label={`Search for ${item.category} on Amazon`}
                >
                  <span aria-hidden="true">🛒</span> Amazon
                </a>
                <a
                  href={item.searchUrls.flipkart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center text-sm sm:text-base font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  data-testid="flipkart-link"
                  aria-label={`Search for ${item.category} on Flipkart`}
                >
                  <span aria-hidden="true">🛍️</span> Flipkart
                </a>
                <a
                  href={item.searchUrls.pepperfry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-center text-sm sm:text-base font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                  data-testid="pepperfry-link"
                  aria-label={`Search for ${item.category} on Pepperfry`}
                >
                  <span aria-hidden="true">🏠</span> Pepperfry
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
