import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from '../components/ErrorDisplay';

describe('ErrorDisplay Component', () => {
  it('renders warning variant with correct styling', () => {
    render(
      <ErrorDisplay
        type="warning"
        message="This is a warning message"
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('renders error variant with correct styling', () => {
    render(
      <ErrorDisplay
        type="error"
        message="This is an error message"
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('renders retry button when retryAction is provided', () => {
    const mockRetry = jest.fn();
    
    render(
      <ErrorDisplay
        type="error"
        message="Operation failed"
        retryAction={mockRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when retryAction is not provided', () => {
    render(
      <ErrorDisplay
        type="error"
        message="Operation failed"
      />
    );

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('displays custom error messages correctly', () => {
    const customMessage = 'Using default room analysis. Results may vary.';
    
    render(
      <ErrorDisplay
        type="warning"
        message={customMessage}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
