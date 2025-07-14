import React, { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface ApiDataContainerProps {
  isLoading: boolean;
  error: string | null;
  data: any | null;
  loadingText?: string;
  emptyText?: string;
  onRetry?: () => void;
  renderData: (data: any) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
}

/**
 * Component for handling API data fetching with loading and error states
 */
export const ApiDataContainer: React.FC<ApiDataContainerProps> = ({
  isLoading,
  error,
  data,
  loadingText = 'Loading...',
  emptyText = 'No data available.',
  onRetry,
  renderData,
  loadingComponent,
  errorComponent,
  emptyComponent,
}) => {
  // Show loading state
  if (isLoading) {
    return loadingComponent || <LoadingSpinner text={loadingText} />;
  }

  // Show error state
  if (error) {
    return errorComponent || <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  // Show empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return emptyComponent || <div className="text-center py-8">{emptyText}</div>;
  }

  // Render data
  return <>{renderData(data)}</>;
};