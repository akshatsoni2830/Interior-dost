/**
 * Tests for Intent Input Component
 * Feature: interior-dost-mvp
 * Property 4: Preset Selection Populates Intent
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import IntentInput from '@/components/IntentInput';
import { VibePreset } from '@/types';

describe('IntentInput Component', () => {
  describe('Property 4: Preset Selection Populates Intent', () => {
    /**
     * Property: For any vibe preset selection, the User_Intent text field
     * should be automatically populated with the corresponding preset value.
     * 
     * Feature: interior-dost-mvp, Property 4: Preset Selection Populates Intent
     * Validates: Requirements 3.3
     */
    test('should populate text input when any preset is selected', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<VibePreset>('modern', 'traditional', 'minimalist', 'bohemian'),
          (preset) => {
            const mockOnChange = jest.fn();
            const mockOnPresetSelect = jest.fn();
            
            const { container, unmount } = render(
              <IntentInput
                value=""
                onChange={mockOnChange}
                onPresetSelect={mockOnPresetSelect}
              />
            );

            try {
              // Find the preset button
              const presetButton = container.querySelector(`[data-preset="${preset}"]`) as HTMLButtonElement;
              expect(presetButton).toBeInTheDocument();

              // Click the preset button
              fireEvent.click(presetButton);

              // Verify onChange was called with the preset label
              expect(mockOnChange).toHaveBeenCalled();
              const calledValue = mockOnChange.mock.calls[0][0];
              expect(typeof calledValue).toBe('string');
              expect(calledValue.length).toBeGreaterThan(0);

              // Verify onPresetSelect was called with the preset
              expect(mockOnPresetSelect).toHaveBeenCalledWith(preset);
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Preset selection should always trigger both onChange and onPresetSelect callbacks
     */
    test('should trigger both callbacks for all preset selections', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<VibePreset>('modern', 'traditional', 'minimalist', 'bohemian'),
          (preset) => {
            const mockOnChange = jest.fn();
            const mockOnPresetSelect = jest.fn();
            
            const { container, unmount } = render(
              <IntentInput
                value=""
                onChange={mockOnChange}
                onPresetSelect={mockOnPresetSelect}
              />
            );

            try {
              const presetButton = container.querySelector(`[data-preset="${preset}"]`) as HTMLButtonElement;
              fireEvent.click(presetButton);

              // Both callbacks should be called exactly once
              expect(mockOnChange).toHaveBeenCalledTimes(1);
              expect(mockOnPresetSelect).toHaveBeenCalledTimes(1);
              
              // onPresetSelect should receive the exact preset value
              expect(mockOnPresetSelect).toHaveBeenCalledWith(preset);
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Text input value should be controllable and reflect the value prop
     */
    test('should display the provided value in text input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (inputValue) => {
            const mockOnChange = jest.fn();
            const mockOnPresetSelect = jest.fn();
            
            const { unmount } = render(
              <IntentInput
                value={inputValue}
                onChange={mockOnChange}
                onPresetSelect={mockOnPresetSelect}
              />
            );

            try {
              const textInput = screen.getByLabelText('User intent text input') as HTMLInputElement;
              expect(textInput.value).toBe(inputValue);
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Text input changes should trigger onChange callback
     */
    test('should call onChange when text input is modified', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (newValue) => {
            const mockOnChange = jest.fn();
            const mockOnPresetSelect = jest.fn();
            
            const { unmount } = render(
              <IntentInput
                value=""
                onChange={mockOnChange}
                onPresetSelect={mockOnPresetSelect}
              />
            );

            try {
              const textInput = screen.getByLabelText('User intent text input') as HTMLInputElement;
              
              fireEvent.change(textInput, { target: { value: newValue } });

              expect(mockOnChange).toHaveBeenCalledWith(newValue);
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Requirements 3.1, 3.2', () => {
    /**
     * Test that text input exists
     * Requirement 3.1
     */
    test('should render text input field', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const textInput = screen.getByLabelText('User intent text input');
      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveAttribute('type', 'text');
      expect(textInput).toHaveAttribute('placeholder');
    });

    /**
     * Test that at least 3 presets exist
     * Requirement 3.2
     */
    test('should render at least 3 vibe presets', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      const { container } = render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      // Find all preset buttons
      const presetButtons = container.querySelectorAll('[data-preset]');
      
      // Should have at least 3 presets
      expect(presetButtons.length).toBeGreaterThanOrEqual(3);
      
      // Verify they are buttons
      presetButtons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    /**
     * Test that all 4 required presets exist
     * Requirement 3.2
     */
    test('should render all 4 required vibe presets', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      const { container } = render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const requiredPresets: VibePreset[] = ['modern', 'traditional', 'minimalist', 'bohemian'];
      
      requiredPresets.forEach((preset) => {
        const presetButton = container.querySelector(`[data-preset="${preset}"]`);
        expect(presetButton).toBeInTheDocument();
        expect(presetButton?.textContent).toBeTruthy();
      });
    });

    /**
     * Test disabled state
     */
    test('should disable all inputs when disabled prop is true', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      const { container } = render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
          disabled={true}
        />
      );

      const textInput = screen.getByLabelText('User intent text input') as HTMLInputElement;
      expect(textInput.disabled).toBe(true);

      const presetButtons = container.querySelectorAll('[data-preset]') as NodeListOf<HTMLButtonElement>;
      presetButtons.forEach((button) => {
        expect(button.disabled).toBe(true);
      });
    });

    /**
     * Test that preset buttons have accessible labels
     */
    test('should have accessible labels for all preset buttons', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      const { container } = render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const presetButtons = container.querySelectorAll('[data-preset]') as NodeListOf<HTMLButtonElement>;
      
      presetButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
        const ariaLabel = button.getAttribute('aria-label');
        expect(ariaLabel).toContain('Select');
        expect(ariaLabel).toContain('preset');
      });
    });

    /**
     * Test that text input has proper attributes
     */
    test('should have proper attributes on text input', () => {
      const mockOnChange = jest.fn();
      const mockOnPresetSelect = jest.fn();
      
      render(
        <IntentInput
          value=""
          onChange={mockOnChange}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const textInput = screen.getByLabelText('User intent text input') as HTMLInputElement;
      
      expect(textInput).toHaveAttribute('id', 'intent-input');
      expect(textInput).toHaveAttribute('type', 'text');
      expect(textInput).toHaveAttribute('placeholder');
      expect(textInput).toHaveAttribute('aria-label', 'User intent text input');
    });
  });
});
