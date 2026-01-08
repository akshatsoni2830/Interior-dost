/**
 * Tests for Upload Component
 * Feature: interior-dost-mvp
 * Property 16: Valid Image Preview Generation
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import UploadComponent from '@/components/UploadComponent';

describe('UploadComponent', () => {
  describe('Property 16: Valid Image Preview Generation', () => {
    /**
     * Property: For any valid image file (jpg or png, ≤10MB),
     * the system should generate a preview URL that can be displayed in the UI.
     */
    test('should generate preview URL for all valid image files', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            type: fc.constantFrom('image/jpeg', 'image/png'),
            size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }), // 1 byte to 10MB
          }),
          async (fileProps) => {
            const mockCallback = jest.fn();
            
            const { container, unmount } = render(
              <UploadComponent
                onImageSelected={mockCallback}
                maxSizeMB={10}
                acceptedFormats={['image/jpeg', 'image/png']}
              />
            );

            try {
              // Create a valid file
              const file = new File(
                [new ArrayBuffer(fileProps.size)],
                fileProps.name,
                { type: fileProps.type }
              );

              const input = container.querySelector('[data-testid="file-input"]') as HTMLInputElement;

              // Mock FileReader
              const mockFileReader = {
                readAsDataURL: jest.fn(),
                onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
                onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
                result: `data:${fileProps.type};base64,mockBase64Data`,
              };

              jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

              // Simulate file selection
              Object.defineProperty(input, 'files', {
                value: [file],
                writable: false,
              });

              fireEvent.change(input);

              // Trigger the onload callback
              if (mockFileReader.onload) {
                mockFileReader.onload.call(mockFileReader as any, {
                  target: mockFileReader,
                } as any);
              }

              await waitFor(() => {
                // Verify callback was called with file and preview URL
                expect(mockCallback).toHaveBeenCalledWith(
                  file,
                  expect.stringContaining('data:')
                );

                // Verify preview is displayed
                const preview = container.querySelector('[data-testid="image-preview"]');
                expect(preview).toBeInTheDocument();
                expect(preview).toHaveAttribute('src', expect.stringContaining('data:'));
              });

              jest.restoreAllMocks();
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Preview URL should be a valid data URL
     */
    test('generated preview URL should be a valid data URL format', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            type: fc.constantFrom('image/jpeg', 'image/png'),
            size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
          }),
          async (fileProps) => {
            const mockCallback = jest.fn();
            
            const { container, unmount } = render(
              <UploadComponent
                onImageSelected={mockCallback}
                maxSizeMB={10}
                acceptedFormats={['image/jpeg', 'image/png']}
              />
            );

            try {
              const file = new File(
                [new ArrayBuffer(fileProps.size)],
                fileProps.name,
                { type: fileProps.type }
              );

              const input = container.querySelector('[data-testid="file-input"]') as HTMLInputElement;

              const mockFileReader = {
                readAsDataURL: jest.fn(),
                onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
                onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
                result: `data:${fileProps.type};base64,mockBase64Data`,
              };

              jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

              Object.defineProperty(input, 'files', {
                value: [file],
                writable: false,
              });

              fireEvent.change(input);

              if (mockFileReader.onload) {
                mockFileReader.onload.call(mockFileReader as any, {
                  target: mockFileReader,
                } as any);
              }

              await waitFor(() => {
                expect(mockCallback).toHaveBeenCalled();
                const [, previewUrl] = mockCallback.mock.calls[0];
                
                // Verify it's a data URL
                expect(previewUrl).toMatch(/^data:/);
                expect(typeof previewUrl).toBe('string');
                expect(previewUrl.length).toBeGreaterThan(0);
              });

              jest.restoreAllMocks();
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Requirement 1.2: Multiple Upload Prevention', () => {
    /**
     * Test that file input only accepts single file
     * Requirement 1.2
     */
    test('file input should not have multiple attribute', () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      
      // Verify multiple attribute is false
      expect(input.multiple).toBe(false);
      expect(input.hasAttribute('multiple')).toBe(false);
    });

    test('should only process first file when multiple files are somehow provided', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file1 = new File([new ArrayBuffer(1024)], 'test1.jpg', {
        type: 'image/jpeg',
      });
      const file2 = new File([new ArrayBuffer(1024)], 'test2.jpg', {
        type: 'image/jpeg',
      });

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        result: 'data:image/jpeg;base64,mockData',
      };

      jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

      // Try to set multiple files (simulating edge case)
      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        writable: false,
      });

      fireEvent.change(input);

      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {
          target: mockFileReader,
        } as any);
      }

      await waitFor(() => {
        // Should only process the first file
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          file1,
          expect.any(String)
        );
      });

      jest.restoreAllMocks();
    });
  });

  describe('Unit Tests - Additional Validation', () => {
    test('should display error for invalid file type', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file = new File([new ArrayBuffer(1024)], 'test.gif', {
        type: 'image/gif',
      });

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Invalid file type');
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    test('should display error for oversized file', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('exceeds 10MB');
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    test('should display preview for valid file', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file = new File([new ArrayBuffer(1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        result: 'data:image/jpeg;base64,testData',
      };

      jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {
          target: mockFileReader,
        } as any);
      }

      await waitFor(() => {
        const preview = screen.getByTestId('image-preview');
        expect(preview).toBeInTheDocument();
        expect(preview).toHaveAttribute('src', 'data:image/jpeg;base64,testData');
        expect(mockCallback).toHaveBeenCalledWith(file, 'data:image/jpeg;base64,testData');
      });

      jest.restoreAllMocks();
    });

    test('should clear preview when clear button is clicked', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file = new File([new ArrayBuffer(1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        result: 'data:image/jpeg;base64,testData',
      };

      jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {
          target: mockFileReader,
        } as any);
      }

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });

      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
        expect(screen.getByTestId('upload-area')).toBeInTheDocument();
      });

      jest.restoreAllMocks();
    });

    test('should handle FileReader error gracefully', async () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
        />
      );

      const file = new File([new ArrayBuffer(1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
        result: null,
      };

      jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader as any);

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      // Trigger error
      if (mockFileReader.onerror) {
        mockFileReader.onerror.call(mockFileReader as any, {} as any);
      }

      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Failed to read file');
        expect(mockCallback).not.toHaveBeenCalled();
      });

      jest.restoreAllMocks();
    });

    test('should be disabled when disabled prop is true', () => {
      const mockCallback = jest.fn();
      
      render(
        <UploadComponent
          onImageSelected={mockCallback}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png']}
          disabled={true}
        />
      );

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      expect(input.disabled).toBe(true);

      const uploadArea = screen.getByTestId('upload-area');
      expect(uploadArea).toHaveClass('opacity-50');
      expect(uploadArea).toHaveClass('cursor-not-allowed');
    });
  });
});
