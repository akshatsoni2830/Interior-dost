import React from 'react';

interface ErrorDisplayProps {
  type: 'warning' | 'error';
  message: string;
  retryAction?: () => void;
}

export default function ErrorDisplay({ type, message, retryAction }: ErrorDisplayProps) {
  const isWarning = type === 'warning';
  
  // Styling based on error type
  const containerClasses = isWarning
    ? 'bg-yellow-50 border-yellow-500 text-yellow-900'
    : 'bg-red-50 border-red-500 text-red-900';
  
  const iconClasses = isWarning
    ? 'text-yellow-600'
    : 'text-red-600';
  
  const buttonClasses = isWarning
    ? 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-300'
    : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300';

  return (
    <div 
      className={`border-l-4 p-4 sm:p-6 rounded-xl shadow-lg ${containerClasses} animate-shake`} 
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          {isWarning ? (
            <svg
              className={`h-6 w-6 sm:h-7 sm:w-7 ${iconClasses}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className={`h-6 w-6 sm:h-7 sm:w-7 ${iconClasses}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold mb-1">
            {isWarning ? '⚠️ Warning' : '❌ Error'}
          </p>
          <p className="text-sm sm:text-base leading-relaxed break-words">
            {message}
          </p>
          {retryAction && (
            <div className="mt-3 sm:mt-4">
              <button
                onClick={retryAction}
                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 ${buttonClasses}`}
                type="button"
                aria-label="Retry the failed operation"
              >
                <span aria-hidden="true">🔄</span> Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
