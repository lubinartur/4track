'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type OnboardingMovieRating = 'like' | 'not-seen';

export type OnboardingState = {
  hasCompletedOnboarding: boolean;
  selectedGenres: string[];
  ratedMovieIds: string[];
  ratedMoviesCount: number;
  ratedMovieRatingsById: Record<string, OnboardingMovieRating>;

  toggleGenre: (genre: string, max?: number) => void;
  setSelectedGenres: (genres: string[]) => void;
  rateMovie: (movieId: string, rating: OnboardingMovieRating) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const MAX_GENRES_DEFAULT = 3;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      selectedGenres: [],
      ratedMovieIds: [],
      ratedMoviesCount: 0,
      ratedMovieRatingsById: {},

      toggleGenre(genre, max = MAX_GENRES_DEFAULT) {
        const prev = get().selectedGenres;
        const isOn = prev.includes(genre);
        if (isOn) {
          const next = prev.filter((g) => g !== genre);
          set({ selectedGenres: next });
          return;
        }
        if (prev.length >= max) return;
        set({ selectedGenres: [...prev, genre] });
      },

      setSelectedGenres(genres) {
        set({ selectedGenres: Array.from(new Set(genres)).slice(0, MAX_GENRES_DEFAULT) });
      },

      rateMovie(movieId, rating) {
        const prevRatings = get().ratedMovieRatingsById;
        const prevIds = get().ratedMovieIds;
        const already = prevRatings[movieId] != null;
        const nextRatings = { ...prevRatings, [movieId]: rating };
        const nextIds = already ? prevIds : [...prevIds, movieId];
        set({
          ratedMovieRatingsById: nextRatings,
          ratedMovieIds: nextIds,
          ratedMoviesCount: nextIds.length,
        });
      },

      completeOnboarding() {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding() {
        set({
          hasCompletedOnboarding: false,
          selectedGenres: [],
          ratedMovieIds: [],
          ratedMoviesCount: 0,
          ratedMovieRatingsById: {},
        });
      },
    }),
    {
      name: '4track-onboarding',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        hasCompletedOnboarding: s.hasCompletedOnboarding,
        selectedGenres: s.selectedGenres,
        ratedMovieIds: s.ratedMovieIds,
        ratedMoviesCount: s.ratedMoviesCount,
        ratedMovieRatingsById: s.ratedMovieRatingsById,
      }),
    },
  ),
);

