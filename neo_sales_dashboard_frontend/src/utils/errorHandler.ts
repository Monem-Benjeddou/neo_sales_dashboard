import { ApiError } from '../types';

/**
 * Formats API errors into user-friendly messages
 * @param error The error object from the API
 * @returns A user-friendly error message
 */
export const formatApiError = (error: ApiError | Error | unknown): string => {
  // Handle ApiError type
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const apiError = error as ApiError;
    
    // Handle common HTTP status codes
    switch (apiError.status) {
      case 400:
        return apiError.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return apiError.message || `Error ${apiError.status}: An unexpected error occurred.`;
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.';
  }
  
  // Handle unknown error types
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Logs errors to the console and potentially to a monitoring service
 * @param error The error to log
 * @param context Additional context about where the error occurred
 */
export const logError = (error: unknown, context: string = 'Application'): void => {
  console.error(`[${context}] Error:`, error);
  
  // Here you could add integration with error monitoring services like Sentry
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { tags: { context } });
  // }
};