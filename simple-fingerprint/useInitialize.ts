import { useEffect, useRef } from 'react';

/**
 * Custom hook to run initialization logic only once
 * Prevents double-execution in React StrictMode during development
 * @param callback - Function to run on initialization
 */
export function useInitialize(callback: () => void | Promise<void>): void {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      callback();
    }
  }, [callback]);
}
