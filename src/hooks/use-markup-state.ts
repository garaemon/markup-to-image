'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarkupState, defaultState, decodeState, encodeState } from '@/lib/url-state';
import { useDebounce } from './use-debounce';

export function useMarkupState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState<MarkupState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load initial state from URL
    const decoded = decodeState(searchParams);
    setState(decoded);
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    if (!isLoaded) {
return;
}
    
    const queryString = encodeState(debouncedState);
    router.replace(`?${queryString}`, { scroll: false });
  }, [debouncedState, router, isLoaded]);

  const updateState = useCallback((updates: Partial<MarkupState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState, isLoaded };
}
