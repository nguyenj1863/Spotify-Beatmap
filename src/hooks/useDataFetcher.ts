import { useCallback, useState } from "react";

/**
 * Custom hook to handle data fetching with loading and error state.
 * @param fetcher The async function to execute.
 * @param initialData The initial state for the data.
 * @returns An object containing the data, loading state, error state, and the fetcher function.
 */
export function useDataFetcher<T>(
  fetcher: () => Promise<T>,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeFetch = useCallback(async (): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : `An unknown error occurred during fetch.`;
      setError(msg);
      // Return undefined on error
      return undefined; 
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  return { data, isLoading, error, executeFetch, setData };
}