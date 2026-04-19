'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const FLASH_MS = 650;

/**
 * Brief checkmark flash after Add to Queue, then persistent state comes from the store (Plus + “In Queue”).
 */
export function useQueueSuccessFlash() {
  const [flash, setFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlash(true);
    timerRef.current = setTimeout(() => {
      setFlash(false);
      timerRef.current = null;
    }, FLASH_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { queueSuccessFlash: flash, triggerQueueSuccessFlash: triggerFlash };
}
