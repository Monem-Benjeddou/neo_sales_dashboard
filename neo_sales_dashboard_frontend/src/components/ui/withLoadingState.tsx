import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface WithLoadingStateProps {
  isLoading: boolean;
  error: string | null;
  loadingText?: string;
  onRetry?: () => void;
}

/**
 * Higher-order component that handles loading and error states
 * @param Component The component to wrap
 * @returns A new component that handles loading and error states
 */
export const withLoadingState = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return ({
    isLoading,
    error,
    loadingText = 'Loading...',
    onRetry,
    ...props
  }: WithLoadingStateProps & P) => {
    if (isLoading) {
      return <LoadingSpinner fullPage text={loadingText} />;
    }

    if (error) {
      return <ErrorDisplay error={error} fullPage onRetry={onRetry} />;
    }

    return <Component {...(props as P)} />;
  };
};