import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { usePageReload } from '../../hooks';

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
    // Use the page reload hook to detect page reloads
    const { isReloading } = usePageReload();
    
    // Show loading spinner if data is loading or page is reloading
    if (isLoading || isReloading) {
      return <LoadingSpinner fullPage text={loadingText} />;
    }

    if (error) {
      return <ErrorDisplay error={error} fullPage onRetry={onRetry} />;
    }

    return <Component {...(props as P)} />;
  };
};