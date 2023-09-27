import { useState } from 'react';

export function usePersistentState<T>(storageKey: string, defaultValue?: T) {
  const [data, setData] = useState<T>(() => {
    const localStorageData = localStorage.getItem(storageKey);

    try {
      return localStorageData ? JSON.parse(localStorageData) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  return [
    data,
    (newData: T) => {
      localStorage.setItem(storageKey, JSON.stringify(newData));
      setData(newData);
    },
  ] as const;
}
