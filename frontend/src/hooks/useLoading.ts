"use client";

import { useState, useCallback } from "react";

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingReturn {
  loading: LoadingState;
  isLoading: (key?: string) => boolean;
  setLoading: (key: string, value: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  isAnyLoading: () => boolean;
}

export function useLoading(initialState: LoadingState = {}): UseLoadingReturn {
  const [loading, setLoadingState] = useState<LoadingState>(initialState);

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key?: string) => {
    if (!key) return Object.values(loading).some(Boolean);
    return loading[key] || false;
  }, [loading]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  const withLoading = useCallback(async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    isAnyLoading
  };
}

export function useApiLoading() {
  return useLoading({
    fetch: false,
    create: false,
    update: false,
    delete: false
  });
}
