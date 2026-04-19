'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { LibraryMovieInput } from '@/lib/libraryMovieInput';
import RateMovieSheet from './RateMovieSheet';

type RatingSheetContextValue = {
  openRateMovieSheet: (input: LibraryMovieInput) => void;
};

const RatingSheetContext = createContext<RatingSheetContextValue | null>(null);

export function useOpenRateMovieSheet() {
  const ctx = useContext(RatingSheetContext);
  if (!ctx) {
    throw new Error('useOpenRateMovieSheet must be used within RatingSheetProvider');
  }
  return ctx.openRateMovieSheet;
}

export function RatingSheetProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<LibraryMovieInput | null>(null);
  const open = target !== null;

  const openRateMovieSheet = useCallback((input: LibraryMovieInput) => {
    setTarget(input);
  }, []);

  const close = useCallback(() => setTarget(null), []);

  const value = useMemo(() => ({ openRateMovieSheet }), [openRateMovieSheet]);

  return (
    <RatingSheetContext.Provider value={value}>
      {children}
      <RateMovieSheet open={open} target={target} onClose={close} />
    </RatingSheetContext.Provider>
  );
}
