'use client';

import { useOpenRateMovieSheet } from '@/components/rating/RatingSheetProvider';

/**
 * Single entry point for “Watched → RateMovieSheet → Save” across the app.
 * Reuses the same provider-backed sheet as `useOpenRateMovieSheet`.
 */
export function useWatchedRateSheet() {
  const openRateMovieSheet = useOpenRateMovieSheet();
  return { openWatchedRateSheet: openRateMovieSheet };
}
