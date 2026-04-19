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

function buildEntry(
  input: LibraryMovieInput,
  patch: Partial<LibraryEntry>,
  prev?: LibraryEntry | null,
): LibraryEntry {
  return {
    id: input.key,
    title: input.title,
    rating: input.rating,
    year: input.year,
    genresLabel: input.genresLabel,
    posterUrl: input.posterUrl,
    itemSlug: input.itemSlug ?? (input.key.startsWith('tmdb-') ? undefined : input.key),
    status: patch.status ?? prev?.status ?? 'queue',
    favorite: patch.favorite ?? prev?.favorite ?? false,
    userRating:
      patch.userRating !== undefined ? patch.userRating : prev?.userRating,
    tasteTags: patch.tasteTags !== undefined ? patch.tasteTags : (prev?.tasteTags ?? []),
  };
}

type LibraryStoreState = {
  entriesByKey: Record<string, LibraryEntry>;
  addToQueue: (input: LibraryMovieInput) => void;
  markWatched: (input: LibraryMovieInput) => void;
  /** Completes the rate flow: watched + user stars + taste tags (preserves favorite, moves queue → watched). */
  saveRatedWatched: (
    input: LibraryMovieInput,
    payload: { userRating: number; tasteTags: string[] },
  ) => void;
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
            [input.key]: buildEntry(input, { status: 'queue' }, prev),
          },
        });
      },

      markWatched(input) {
        const prev = get().entriesByKey[input.key];
        set({
          entriesByKey: {
            ...get().entriesByKey,
            [input.key]: buildEntry(input, { status: 'watched' }, prev),
          },
        });
      },

      saveRatedWatched(input, { userRating, tasteTags }) {
        const prev = get().entriesByKey[input.key];
        set({
          entriesByKey: {
            ...get().entriesByKey,
            [input.key]: buildEntry(
              input,
              {
                status: 'watched',
                userRating,
                tasteTags,
              },
              prev,
            ),
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
            [input.key]: buildEntry(input, { status, favorite }, prev),
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
      version: 2,
      migrate: (persisted, fromVersion) => {
        const p = persisted as { entriesByKey?: Record<string, LibraryEntry> } | undefined;
        if (fromVersion < 2 && p?.entriesByKey) {
          for (const key of Object.keys(p.entriesByKey)) {
            const e = p.entriesByKey[key];
            if (e && !Array.isArray(e.tasteTags)) {
              e.tasteTags = [];
            }
          }
        }
        return p as typeof persisted;
      },
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
