'use client';

import React, { JSX } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-danger" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-400 mb-6">
            An unexpected error occurred. This might be a temporary issue.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={resetError}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary w-full"
            >
              Go to Dashboard
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-400 bg-background-secondary p-3 rounded overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for handling errors in functional components
export function useErrorHandler(): (error: Error, errorInfo?: React.ErrorInfo) => void {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error handled by hook:', error, errorInfo);
    // TODO: Send to logging service
  };
}