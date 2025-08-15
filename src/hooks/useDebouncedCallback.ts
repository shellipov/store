import { useRef, useCallback } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPendingRef = useRef(false);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      isPendingRef.current = true;

      timeoutRef.current = setTimeout(() => {
        isPendingRef.current = false;
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return { debouncedFn, isPendingRef };
}
