'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { db } from '@/db/db';
import { makeEntryId } from '@/db/entryId';
import { makeLocalSourceIdFromTitle } from '@/lib/localSourceId';
import { LEGACY_FILMS_ENABLED } from '@/lib/flags';
import { upsertEntry, getEntry } from '@/repos/entriesRepo';
import { upsertCatalogItems, getCatalogItem } from '@/repos/catalogRepo';
import { searchTmdb } from '@/providers/tmdbClient';
import { useEntriesExist } from '@/db/hooksEntriesCheck';

const IconFilm = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" />
  </svg>
);

const IconTraining = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9v6" />
    <path d="M7 7v10" />
    <path d="M10 12h4" />
    <path d="M14 7v10" />
    <path d="M18 9v6" />
  </svg>
);

const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4Z" />
    <path d="M5 18h11" />
    <path d="M9 8h7" />
  </svg>
);

const IconNote = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M10 13h4" />
    <path d="M10 17h4" />
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const actionItems = [
  { icon: IconFilm, label: 'Film / Series' },
  { icon: IconTraining, label: 'Training' },
  { icon: IconBook, label: 'Book' },
  { icon: IconNote, label: 'Note' },
];

interface TMDBSearchResult {
  source: 'tmdb';
  sourceId: number;
  domain: 'film' | 'series';
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
}

export default function AddSheet() {
  const { isAddOpen, closeAdd } = useUIStore();
  const router = useRouter();
  const [showFilmForm, setShowFilmForm] = useState(false);
  const [showFilmSearch, setShowFilmSearch] = useState(false);
  const [filmForm, setFilmForm] = useState({
    title: '',
    rating: '',
    tags: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDomain, setSearchDomain] = useState<'film' | 'series'>('film');
  const [actionError, setActionError] = useState<string | null>(null);

  // Compute entryIds for search results and check if they exist
  const entryIds = searchResults.map((result) => 
    makeEntryId('tmdb', result.domain, String(result.sourceId))
  );
  const entriesMap = useEntriesExist(entryIds);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      setSearchLoading(true);
      try {
        const results = await searchTmdb(debouncedQuery, searchDomain);
        setSearchResults(results);
      } catch (error) {
        console.error('TMDB search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchDomain]);

  if (!isAddOpen) return null;

  const handleFilmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse tags: comma-separated, trimmed, uppercase, max 3
      const tagsArray = filmForm.tags
        .split(',')
        .map((tag) => tag.trim().toUpperCase())
        .filter((tag) => tag.length > 0)
        .slice(0, 3);

      const title = filmForm.title.trim();
      const rating = parseFloat(filmForm.rating) || 0;
      const now = Date.now();

      // Legacy films write (disabled by default, enable via NEXT_PUBLIC_LEGACY_FILMS_ENABLED=true)
      if (LEGACY_FILMS_ENABLED) {
        const film = {
          id: crypto.randomUUID(),
          title,
          rating,
          tags: tagsArray,
          createdAt: now,
        };
        await db.films.put(film);
      }

      // Write to new core tables (entries + catalog)
      // Generate deterministic sourceId from title (no year field in form, so omit year)
      const sourceId = makeLocalSourceIdFromTitle(title);
      const entryId = makeEntryId('tmdb', 'film', sourceId);

      // Upsert catalog item
      await upsertCatalogItems([
        {
          id: entryId,
          source: 'tmdb',
          sourceId,
          domain: 'film',
          title,
          genres: tagsArray, // Use tags as genres for now
          // year, overview, posterUrl, backdropUrl left empty
        },
      ]);

      // Upsert entry
      await upsertEntry({
        id: entryId,
        domain: 'film',
        status: 'watched',
        userRating: rating,
        whyTags: tagsArray,
        watchedAt: now,
        // queuedAt: undefined (not set)
        // createdAt/updatedAt handled by repo
      });
      
      // Reset form and close
      setFilmForm({ title: '', rating: '', tags: '' });
      setShowFilmForm(false);
      closeAdd();
    } catch (error) {
      console.error('Error adding film:', error);
    }
  };

  const handleFilmCancel = () => {
    setFilmForm({ title: '', rating: '', tags: '' });
    setShowFilmForm(false);
  };

  const handleFilmClick = () => {
    setShowFilmSearch(true);
    setSearchDomain('film');
  };

  const handleTMDBResultAction = async (result: TMDBSearchResult, status: 'watched' | 'queued') => {
    setActionError(null);
    
    try {
      const now = Date.now();
      // Force sourceId to be a string
      const sourceId = String(result.sourceId);
      const entryId = makeEntryId('tmdb', result.domain, sourceId);

      // Ensure ALL async writes are awaited
      await upsertCatalogItems([
        {
          id: entryId,
          source: 'tmdb',
          sourceId: sourceId,
          domain: result.domain,
          title: result.title,
          year: result.year,
          overview: result.overview,
          posterUrl: result.posterUrl,
          backdropUrl: result.backdropUrl,
          genres: result.genres,
        },
      ]);

      await upsertEntry({
        id: entryId,
        domain: result.domain,
        status,
        watchedAt: status === 'watched' ? now : undefined,
        queuedAt: status === 'queued' ? now : undefined,
        // userRating and whyTags skipped for now
      });

      // Temporary verification log (debug)
      const e = await getEntry(entryId);
      const c = await getCatalogItem(entryId);
      console.log('verify saved', { entryId, hasEntry: !!e, hasCatalog: !!c });

      // After successful writes: close sheet, then navigate, then refresh
      setShowFilmSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      closeAdd();
      
      // Small delay to ensure writes are fully persisted
      await new Promise(r => setTimeout(r, 50));
      
      router.push(`/item/${entryId}`);
      router.refresh();
    } catch (error) {
      console.error('Error adding item:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to add item. Please try again.');
      // DO NOT navigate/close on error
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeAdd}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-[36px] border-t border-white/5 bg-[#141420]/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div className="flex-1">
            <h2 className="text-[28px] font-light leading-tight text-primary mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {showFilmForm ? 'Add Film' : showFilmSearch ? 'Search Films' : 'Add'}
            </h2>
            <p className="text-[13px] text-secondary">
              {showFilmForm ? 'Enter film details' : showFilmSearch ? 'Search TMDB' : 'Choose what to add'}
            </p>
          </div>
          <button
            onClick={showFilmForm ? handleFilmCancel : showFilmSearch ? () => { setShowFilmSearch(false); setSearchQuery(''); setSearchResults([]); setActionError(null); } : closeAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/50 transition-colors hover:bg-white/8 hover:text-white/70 ml-4"
            aria-label={showFilmForm || showFilmSearch ? 'Cancel' : 'Close add sheet'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="text-current"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Film Search, Film Form, or Actions List */}
        {showFilmSearch ? (
          <div className="flex flex-col" style={{ height: 'calc(85vh - 120px)', minHeight: '400px' }}>
            {/* Search Input */}
            <div className="px-6 py-4 border-b border-white/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search films and TV shows..."
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[15px] text-primary placeholder:text-white/25 focus:outline-none focus:border-white/10 transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 py-4" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
              {actionError ? (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {actionError}
                </div>
              ) : null}
              {searchLoading ? (
                <div className="text-center py-8 text-tertiary text-sm">Searching...</div>
              ) : !debouncedQuery.trim() ? (
                <div className="text-center py-8 text-tertiary text-sm">Start typing to search</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-tertiary text-sm">
                  No results found. <button onClick={() => setShowFilmForm(true)} className="text-primary underline">Add manually</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.sourceId}-${result.domain}`}
                      className="flex gap-4 rounded-[20px] border border-white/5 bg-[#141420]/50 p-4 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                    >
                      {/* Poster Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-24 rounded-[12px] bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] overflow-hidden">
                        {result.posterUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.posterUrl} alt="" className="w-full h-full object-cover" />
                        ) : null}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-[15px] font-medium leading-tight text-primary line-clamp-1">
                          {result.title}
                        </h3>
                        <div className="mb-3 text-[12px] text-secondary">
                          {result.year ? `${result.year} • ` : ''}{result.domain === 'film' ? 'Movie' : 'TV Series'}
                        </div>
                        {/* Actions or Status */}
                        {(() => {
                          const entryId = makeEntryId('tmdb', result.domain, String(result.sourceId));
                          const existingEntry = entriesMap.get(entryId);
                          
                          if (existingEntry) {
                            // Show status pill for existing entries
                            const status = existingEntry.status;
                            return (
                              <div className="flex gap-2">
                                <div className="flex-1 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 text-center text-[13px] font-medium text-secondary">
                                  {status === 'watched' ? 'Watched' : 'Queued'}
                                </div>
                              </div>
                            );
                          }
                          
                          // Show action buttons for new entries
                          return (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleTMDBResultAction(result, 'watched')}
                                className="flex-1 rounded-full border border-white/5 bg-[#141420]/60 px-4 py-2 text-[13px] font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/10"
                              >
                                Watched
                              </button>
                              <button
                                onClick={() => handleTMDBResultAction(result, 'queued')}
                                className="flex-1 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-secondary transition-colors hover:bg-white/[0.08] hover:border-white/10"
                              >
                                Queue
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Add Button */}
            <div className="px-6 py-3 border-t border-white/5">
              <button
                onClick={() => {
                  setShowFilmSearch(false);
                  setShowFilmForm(true);
                  setActionError(null);
                }}
                className="w-full text-center text-[12px] font-medium text-white/50 transition-colors hover:text-white/70"
              >
                Manual add
              </button>
            </div>
          </div>
        ) : showFilmForm ? (
          <form onSubmit={handleFilmSubmit} className="px-6 py-6 space-y-4" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            {/* Title */}
            <div>
              <label className="block mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-tertiary">
                Title
              </label>
              <input
                type="text"
                value={filmForm.title}
                onChange={(e) => setFilmForm({ ...filmForm, title: e.target.value })}
                required
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[15px] text-primary placeholder:text-white/25 focus:outline-none focus:border-white/10 transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                placeholder="Film or series title"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-tertiary">
                Rating
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filmForm.rating}
                onChange={(e) => setFilmForm({ ...filmForm, rating: e.target.value })}
                required
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[15px] text-primary placeholder:text-white/25 focus:outline-none focus:border-white/10 transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                placeholder="0.0 - 10.0"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-tertiary">
                Tags (comma-separated, max 3)
              </label>
              <input
                type="text"
                value={filmForm.tags}
                onChange={(e) => setFilmForm({ ...filmForm, tags: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[15px] text-primary placeholder:text-white/25 focus:outline-none focus:border-white/10 transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                placeholder="SCI-FI, ATMOSPHERIC, INTENSE"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleFilmCancel}
                className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[14px] font-medium text-secondary transition-colors hover:bg-white/[0.08] hover:border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!filmForm.title.trim()}
                className="flex-1 rounded-xl border border-white/5 bg-[#141420]/60 px-4 py-3 text-[14px] font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/10 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#141420]/60"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-6 space-y-3" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            {actionItems.map((item, index) => {
              const IconComponent = item.icon;
              const handleClick = item.label === 'Film / Series' ? handleFilmClick : () => closeAdd();
              
              return (
                <button
                  key={index}
                  onClick={handleClick}
                  className="w-full flex items-center gap-4 rounded-[24px] border border-white/5 bg-[#141420]/60 px-5 py-4 text-left transition-all hover:bg-white/[0.08] hover:border-white/8 active:scale-[0.98] shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                >
                  {/* Icon left */}
                  <div className="flex-shrink-0 text-white/60">
                    <IconComponent />
                  </div>
                  {/* Label center */}
                  <span className="flex-1 text-[15px] font-medium text-primary">
                    {item.label}
                  </span>
                  {/* Chevron right */}
                  <div className="flex-shrink-0 text-white/35">
                    <IconChevron />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
