/**
 * Tests for Main Application Page
 * Requirement 4.5: Test that OptimizedPrompt is not rendered to UI
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock the components
jest.mock('@/components/UploadComponent', () => {
  return function MockUploadComponent({ onImageSelected, disabled }: any) {
    return (
      <div data-testid="upload-component">
        <button
          onClick={() => onImageSelected(new File([''], 'test.jpg'), 'data:image/jpeg;base64,test')}
          disabled={disabled}
        >
          Mock Upload
        </button>
      </div>
    );
  };
});

jest.mock('@/components/IntentInput', () => {
  return function MockIntentInput({ value, onChange, disabled }: any) {
    return (
      <div data-testid="intent-input">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  };
});

jest.mock('@/components/ResultsDisplay', () => {
  return function MockResultsDisplay({ originalImage, redesignedImage, roomContext, furnitureCategories }: any) {
    return (
      <div data-testid="results-display">
        <div data-testid="original-image">{originalImage}</div>
        <div data-testid="redesigned-image">{redesignedImage}</div>
        <div data-testid="room-context">{JSON.stringify(roomContext)}</div>
        <div data-testid="furniture-categories">{JSON.stringify(furnitureCategories)}</div>
      </div>
    );
  };
});

jest.mock('@/components/ErrorDisplay', () => {
  return function MockErrorDisplay({ type, message }: any) {
    return (
      <div data-testid="error-display">
        {type}: {message}
      </div>
    );
  };
});

describe('Main Application Page', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Requirement 4.5: Test that OptimizedPrompt is not rendered to UI
   * 
   * This test verifies that raw prompt data (positive, negative, metadata)
   * is never displayed to the user interface, even when the full pipeline
   * completes successfully.
   */
  it('should not display raw OptimizedPrompt data in the UI', async () => {
    // Mock API responses with OptimizedPrompt data
    const mockOptimizedPrompt = {
      positive: 'cozy warm modern living room interior, white walls, natural lighting, Indian home aesthetic',
      negative: 'structural changes, demolition, construction, unrealistic, cartoon',
      metadata: {
        room_type: 'living room',
        constraints: ['Indian home', 'rental friendly', 'realistic'],
      },
    };

    const mockRoomContext = {
      room_type: 'living room',
      visible_objects: ['sofa', 'table'],
      wall_color: 'white',
      lighting_type: 'natural',
    };

    const mockFurnitureCategories = [
      {
        category: 'Sofa',
        searchUrls: {
          amazon: 'https://amazon.in/search?q=sofa',
          flipkart: 'https://flipkart.com/search?q=sofa',
          pepperfry: 'https://pepperfry.com/search?q=sofa',
        },
      },
    ];

    // Mock fetch to return successful responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      // Handle the image URL fetch for conversion to base64
      if (url === 'https://example.com/generated.jpg') {
        return Promise.resolve({
          ok: true,
          blob: () => Promise.resolve(new Blob(['fake-image-data'], { type: 'image/jpeg' })),
        });
      }
      if (url === '/api/analyze-room') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockRoomContext,
          }),
        });
      }
      if (url === '/api/generate-image') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            imageUrl: 'https://example.com/generated.jpg',
            // Note: The API might return optimizedPrompt in metadata, but it should not be displayed
            optimizedPrompt: mockOptimizedPrompt,
          }),
        });
      }
      if (url === '/api/detect-furniture') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockFurnitureCategories,
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Render the page
    const { container } = render(<Home />);

    // Simulate user uploading an image
    const uploadButton = screen.getByText('Mock Upload');
    fireEvent.click(uploadButton);

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByTestId('intent-input')).toBeInTheDocument();
    });

    // Simulate user clicking redesign button
    const redesignButton = screen.getByText(/Redesign My Room/i);
    fireEvent.click(redesignButton);

    // Wait for the full pipeline to complete
    await waitFor(() => {
      expect(screen.getByTestId('results-display')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Get the entire page HTML
    const pageHTML = container.innerHTML;

    // Verify that raw prompt strings are NOT in the UI
    expect(pageHTML).not.toContain(mockOptimizedPrompt.positive);
    expect(pageHTML).not.toContain(mockOptimizedPrompt.negative);
    expect(pageHTML).not.toContain('structural changes, demolition');
    expect(pageHTML).not.toContain('Indian home aesthetic, rental friendly');
    
    // Verify that metadata constraints are NOT displayed
    expect(pageHTML).not.toContain('constraints');
    expect(pageHTML).not.toContain(JSON.stringify(mockOptimizedPrompt.metadata));

    // Verify that the results ARE displayed (room context, images, furniture)
    expect(screen.getByTestId('results-display')).toBeInTheDocument();
    expect(screen.getByTestId('room-context')).toHaveTextContent('living room');
    expect(screen.getByTestId('furniture-categories')).toHaveTextContent('Sofa');
  });

  it('should not expose OptimizedPrompt even in error scenarios', async () => {
    const mockOptimizedPrompt = {
      positive: 'test positive prompt with sensitive data',
      negative: 'test negative prompt with sensitive data',
      metadata: {
        room_type: 'bedroom',
        constraints: ['constraint1', 'constraint2'],
      },
    };

    // Mock fetch to return error with prompt data
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/analyze-room') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              room_type: 'bedroom',
              visible_objects: ['bed'],
              wall_color: 'blue',
              lighting_type: 'dim',
            },
          }),
        });
      }
      if (url === '/api/generate-image') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            success: false,
            error: 'Generation failed',
            // Even in error, prompt data should not leak to UI
            optimizedPrompt: mockOptimizedPrompt,
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Render the page
    const { container } = render(<Home />);

    // Simulate user uploading an image
    const uploadButton = screen.getByText('Mock Upload');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('intent-input')).toBeInTheDocument();
    });

    // Simulate user clicking redesign button
    const redesignButton = screen.getByText(/Redesign My Room/i);
    fireEvent.click(redesignButton);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
    });

    // Get the entire page HTML
    const pageHTML = container.innerHTML;

    // Verify that prompt data is NOT exposed in error messages
    expect(pageHTML).not.toContain(mockOptimizedPrompt.positive);
    expect(pageHTML).not.toContain(mockOptimizedPrompt.negative);
    expect(pageHTML).not.toContain('sensitive data');
    expect(pageHTML).not.toContain(JSON.stringify(mockOptimizedPrompt.metadata));

    // Verify error is displayed but without prompt details
    expect(screen.getByTestId('error-display')).toHaveTextContent('Generation failed');
  });
});
