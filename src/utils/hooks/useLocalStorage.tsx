import { useState, useEffect, useCallback } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    setStoredValue(value);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    return () => {
      // Cleanup function to avoid memory leaks
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
