'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { makeEntryId } from '@/db/entryId';
import { db } from '@/db/db';
import { upsertEntry } from '@/repos/entriesRepo';
import { upsertCatalogItems } from '@/repos/catalogRepo';
import { searchTmdb } from '@/providers/tmdbClient';

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

type Weight = 1 | 2 | 3;

export default function TasteOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  // Map<entryId, { result: TMDBSearchResult, weight: Weight }> for each step
  const [selectedFilms, setSelectedFilms] = useState<Map<string, { result: TMDBSearchResult; weight: Weight }>>(new Map());
  const [selectedSeries, setSelectedSeries] = useState<Map<string, { result: TMDBSearchResult; weight: Weight }>>(new Map());
  const [showMaxMessage, setShowMaxMessage] = useState(false);

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
        const domain = step === 1 ? 'film' : 'series';
        const results = await searchTmdb(debouncedQuery, domain);
        setSearchResults(results);
      } catch (error) {
        console.error('TMDB search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, step]);

  // Reset search when step changes
  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, [step]);

  const toggleFavorite = (result: TMDBSearchResult) => {
    const entryId = makeEntryId('tmdb', result.domain, String(result.sourceId));
    const isFilm = result.domain === 'film';
    const selectedMap = isFilm ? selectedFilms : selectedSeries;
    const setSelected = isFilm ? setSelectedFilms : setSelectedSeries;
    
    const totalSelected = selectedFilms.size + selectedSeries.size;
    
    const newSelected = new Map(selectedMap);
    
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
      setShowMaxMessage(false);
    } else {
      // Check max 7 total across both steps
      if (totalSelected >= 7) {
        setShowMaxMessage(true);
        setTimeout(() => setShowMaxMessage(false), 2000);
        return;
      }
      // Default weight is 2, store full result data
      newSelected.set(entryId, { result, weight: 2 });
      setShowMaxMessage(false);
    }
    
    setSelected(newSelected);
  };

  const cycleWeight = (result: TMDBSearchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    const entryId = makeEntryId('tmdb', result.domain, String(result.sourceId));
    const isFilm = result.domain === 'film';
    const selectedMap = isFilm ? selectedFilms : selectedSeries;
    const setSelected = isFilm ? setSelectedFilms : setSelectedSeries;
    
    if (!selectedMap.has(entryId)) return;
    
    const current = selectedMap.get(entryId)!;
    const nextWeight: Weight = current.weight === 1 ? 2 : current.weight === 2 ? 3 : 1;
    
    const newSelected = new Map(selectedMap);
    newSelected.set(entryId, { result: current.result, weight: nextWeight });
    setSelected(newSelected);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleFinish = async () => {
    const totalSelected = selectedFilms.size + selectedSeries.size;
    if (totalSelected < 5) return;

    try {
      const now = Date.now();
      
      // Collect all selected items with their weights (already stored with result data)
      const allSelected: Array<{ result: TMDBSearchResult; weight: Weight }> = [];
      
      // Add films
      for (const item of selectedFilms.values()) {
        allSelected.push(item);
      }
      
      // Add series
      for (const item of selectedSeries.values()) {
        allSelected.push(item);
      }

      // Save all selected items
      for (const { result, weight } of allSelected) {
        const sourceId = String(result.sourceId);
        const entryId = makeEntryId('tmdb', result.domain, sourceId);

        // Upsert catalog item
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

        // Upsert entry with status='watched' (no rating)
        await upsertEntry({
          id: entryId,
          domain: result.domain,
          status: 'watched',
          watchedAt: now,
        });

        // Create TasteSeed with chosen weight
        await db.tasteSeeds.put({
          entryId,
          weight,
          createdAt: now,
        });
      }

      // Navigate to /films
      router.push('/films');
    } catch (error) {
      console.error('Error saving taste preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const isSelected = (result: TMDBSearchResult): boolean => {
    const entryId = makeEntryId('tmdb', result.domain, String(result.sourceId));
    const isFilm = result.domain === 'film';
    const selectedMap = isFilm ? selectedFilms : selectedSeries;
    return selectedMap.has(entryId);
  };

  const getWeight = (result: TMDBSearchResult): Weight | null => {
    const entryId = makeEntryId('tmdb', result.domain, String(result.sourceId));
    const isFilm = result.domain === 'film';
    const selectedMap = isFilm ? selectedFilms : selectedSeries;
    return selectedMap.get(entryId)?.weight || null;
  };

  const totalSelected = selectedFilms.size + selectedSeries.size;
  const canAdvance = totalSelected >= 5 && step === 1;

  // Auto-advance after 400ms when 5 selected on Films step
  useEffect(() => {
    if (canAdvance) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [canAdvance]);

  return (
    <div className="px-6 pt-safe-area-inset-top pb-6">
      {/* Progress Header */}
      <div className="mb-6 pt-8">
        <div className="text-[13px] font-medium text-primary mb-1">
          Step {step}/2: {step === 1 ? 'Films' : 'Series'}
        </div>
        <div className="text-[11px] text-tertiary">
          Selected: {totalSelected}/5 (max 7)
        </div>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-semibold text-primary">Your Taste</h1>
        <p className="text-secondary">
          {step === 1 ? 'Pick your favorite films' : 'Pick your favorite series'}
        </p>
      </div>

      {/* Max Message */}
      {showMaxMessage && (
        <div className="mb-3 text-center text-[11px] text-tertiary">
          Max 7
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={step === 1 ? 'Search films...' : 'Search TV series...'}
          className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[15px] text-primary placeholder:text-white/25 focus:outline-none focus:border-white/10 transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
          autoFocus
        />
      </div>

      {/* Results List */}
      <div className="mb-6 space-y-3" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {searchLoading ? (
          <div className="text-center py-8 text-tertiary text-sm">Searching...</div>
        ) : !debouncedQuery.trim() ? (
          <div className="text-center py-8 text-tertiary text-sm">Start typing to search</div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8 text-tertiary text-sm">No results found</div>
        ) : (
          searchResults.map((result) => {
            const selected = isSelected(result);

            return (
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
                  {selected && (
                    <button
                      onClick={(e) => cycleWeight(result, e)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] font-medium text-secondary hover:bg-white/[0.08] transition-colors"
                    >
                      Weight: {getWeight(result)}
                    </button>
                  )}
                </div>

                {/* Favorite Toggle */}
                <button
                  onClick={() => toggleFavorite(result)}
                  className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                    selected
                      ? 'border-[#ff3d00] bg-[#ff3d00]/20 text-[#ff3d00]'
                      : 'border-white/5 bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:border-white/10'
                  }`}
                  aria-label={selected ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={selected ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-safe-area-inset-bottom pt-4 bg-[#0b0b0f] border-t border-white/5">
        <div className="flex gap-3">
          {step === 2 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[14px] font-medium text-secondary transition-colors hover:bg-white/[0.08] hover:border-white/10"
            >
              Back
            </button>
          )}
          {step === 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 rounded-xl border border-white/5 bg-[#141420]/60 px-4 py-3 text-[14px] font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/10 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={totalSelected < 5}
              className="flex-1 rounded-xl border border-white/5 bg-[#141420]/60 px-4 py-3 text-[14px] font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/10 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#141420]/60"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
