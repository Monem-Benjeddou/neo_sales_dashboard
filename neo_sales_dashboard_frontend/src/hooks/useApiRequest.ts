import { useState, useCallback } from 'react';
import { ApiError } from '../types';
import { formatApiError, logError } from '../utils';

interface UseApiRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError | Error) => void;
  initialData?: T | null;
  errorContext?: string;
}

interface ApiRequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApiRequest<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiRequestOptions<T> = {}
) {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: options.initialData || null,
    isLoading: false,
    error: null,
  });
  const errorContext = options.errorContext || 'API Request';

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await apiFunction(...args);
        setState({ data, isLoading: false, error: null });
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        // Format the error message using our utility
        const errorMessage = formatApiError(error);
        
        // Log the error with context
        logError(error, errorContext);
        
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
        });
        
        if (options.onError) {
          options.onError(error as ApiError | Error);
        }
        
        throw error;
      }
    },
    [apiFunction, options, errorContext]
  );

  const reset = useCallback(() => {
    setState({
      data: options.initialData || null,
      isLoading: false,
      error: null,
    });
  }, [options.initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}