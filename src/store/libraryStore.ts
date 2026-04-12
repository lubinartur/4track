import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LibraryEntry } from '@/app/library/mockData';
import { libraryEntries as librarySeedRows } from '@/app/library/mockData';
import type { LibraryMovieInput } from '@/lib/libraryMovieInput';

function seedRecord(): Record<string, LibraryEntry> {
  const o: Record<string, LibraryEntry> = {};
  for (const e of librarySeedRows) {
    const key = e.itemSlug ?? e.id;
    o[key] = { ...e, id: key };
  }
  return o;
}

function buildEntry(input: LibraryMovieInput, patch: Partial<LibraryEntry>): LibraryEntry {
  return {
    id: input.key,
    title: input.title,
    rating: input.rating,
    year: input.year,
    genresLabel: input.genresLabel,
    posterUrl: input.posterUrl,
    itemSlug: input.itemSlug ?? (input.key.startsWith('tmdb-') ? undefined : input.key),
    status: patch.status ?? 'queue',
    favorite: patch.favorite ?? false,
  };
}

type LibraryStoreState = {
  entriesByKey: Record<string, LibraryEntry>;
  addToQueue: (input: LibraryMovieInput) => void;
  markWatched: (input: LibraryMovieInput) => void;
  toggleFavorite: (input: LibraryMovieInput) => void;
  removeFromLibrary: (key: string) => void;
};

export const useLibraryStore = create<LibraryStoreState>()(
  persist(
    (set, get) => ({
      entriesByKey: seedRecord(),

      addToQueue(input) {
        const prev = get().entriesByKey[input.key];
        set({
          entriesByKey: {
            ...get().entriesByKey,
            [input.key]: buildEntry(input, {
              status: 'queue',
              favorite: prev?.favorite ?? false,
            }),
          },
        });
      },

      markWatched(input) {
        const prev = get().entriesByKey[input.key];
        set({
          entriesByKey: {
            ...get().entriesByKey,
            [input.key]: buildEntry(input, {
              status: 'watched',
              favorite: prev?.favorite ?? false,
            }),
          },
        });
      },

      toggleFavorite(input) {
        const prev = get().entriesByKey[input.key];
        const favorite = !(prev?.favorite ?? false);
        const status = prev?.status ?? 'queue';
        set({
          entriesByKey: {
            ...get().entriesByKey,
            [input.key]: buildEntry(input, { status, favorite }),
          },
        });
      },

      removeFromLibrary(key) {
        const { [key]: _removed, ...rest } = get().entriesByKey;
        set({ entriesByKey: rest });
      },
    }),
    {
      name: '4track-library',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ entriesByKey: s.entriesByKey }),
      version: 1,
      merge: (persisted, current) => {
        const p = persisted as Partial<LibraryStoreState> | undefined;
        return {
          ...current,
          entriesByKey: {
            ...seedRecord(),
            ...(p?.entriesByKey ?? {}),
          },
        };
      },
    },
  ),
);
