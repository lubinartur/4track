'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import BottomNavigation from '@/components/BottomNavigation';
import DiscoverHero from '@/components/discover/DiscoverHero';
import SearchResultItem from '@/components/discover/SearchResultItem';
import { discoverTabItems } from '@/app/discover/mockData';
import type { DiscoverSearchResultItem } from '@/types/discoverSearch';

export default function DiscoverSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsQ = searchParams.get('q') ?? '';
  const committedQ = paramsQ.trim();

  const [activeTab, setActiveTab] = useState<string>(() => discoverTabItems[0].id);
  const [inputValue, setInputValue] = useState(paramsQ);
  const [results, setResults] = useState<DiscoverSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUrlDebounce = useCallback(() => {
    if (urlDebounceRef.current !== null) {
      clearTimeout(urlDebounceRef.current);
      urlDebounceRef.current = null;
    }
  }, []);

  const navigateToSearch = useCallback(
    (raw: string, mode: 'push' | 'replace') => {
      const t = raw.trim();
      const href = t ? `/discover/search?q=${encodeURIComponent(t)}` : '/discover/search';
      if (mode === 'push') router.push(href);
      else router.replace(href);
    },
    [router],
  );

  useEffect(() => {
    setInputValue(paramsQ);
  }, [paramsQ]);

  /** Debounced URL sync (~300ms) so `committedQ` updates and the TMDB fetch runs without Enter. */
  useEffect(() => {
    clearUrlDebounce();

    const trimmedInput = inputValue.trim();
    if (trimmedInput === committedQ) {
      return undefined;
    }

    urlDebounceRef.current = setTimeout(() => {
      urlDebounceRef.current = null;
      navigateToSearch(inputValue, 'replace');
    }, 300);

    return () => {
      if (urlDebounceRef.current !== null) {
        clearTimeout(urlDebounceRef.current);
        urlDebounceRef.current = null;
      }
    };
  }, [inputValue, committedQ, navigateToSearch, clearUrlDebounce]);

  useEffect(() => {
    if (!committedQ) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      setResults([]);
      try {
        const res = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(committedQ)}`,
          { signal: ac.signal, cache: 'no-store' },
        );
        const data = (await res.json()) as {
          results?: DiscoverSearchResultItem[];
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error || 'Search failed');
        }

        setResults(Array.isArray(data.results) ? data.results : []);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Something went wrong');
        setResults([]);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    void run();
    return () => ac.abort();
  }, [committedQ, retryToken]);

  const count = results.length;
  const showEmpty = !loading && !error && count === 0 && committedQ !== '';

  const handleSearchSubmit = useCallback(
    (q: string) => {
      clearUrlDebounce();
      navigateToSearch(q, 'push');
    },
    [clearUrlDebounce, navigateToSearch],
  );

  const handleRetry = useCallback(() => {
    setRetryToken((n) => n + 1);
  }, []);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="relative z-[1] flex flex-col px-4 pb-40 pt-3">
        <main className="flex flex-col">
          <DiscoverHero
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchPlaceholder="Search films..."
            searchValue={inputValue}
            onSearchValueChange={setInputValue}
            onSearchSubmit={handleSearchSubmit}
            searchEmphasized={committedQ.length > 0}
            searchInputId="discover-search-results"
            showTasteInsight={false}
          />

          <header className="mt-6 flex w-full max-w-[358px] items-start justify-between gap-2.5">
            <h2 className="min-w-0 flex-1 text-[20px] font-medium leading-normal text-white">
              Results for &quot;{committedQ}&quot;
            </h2>
            <p className="shrink-0 whitespace-nowrap text-[20px] font-medium leading-normal text-[rgba(255,255,255,0.5)]">
              {loading ? '…' : `${count} ${count === 1 ? 'result' : 'results'}`}
            </p>
          </header>

          {error ? (
            <div className="mt-5 w-full max-w-[358px] rounded-xl border border-[rgba(255,91,0,0.25)] bg-[#101018] px-4 py-3">
              <p className="text-[14px] font-medium leading-snug text-white">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 inline-flex h-9 items-center rounded-lg bg-[#ff5b00] px-3 text-[12px] font-medium text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620]"
              >
                Try again
              </button>
            </div>
          ) : null}

          {!error && loading ? (
            <div
              className="mt-5 flex w-full max-w-[358px] items-center gap-2 text-[16px] font-medium leading-normal text-[rgba(255,255,255,0.5)]"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#ff5b00]" aria-hidden />
              Searching…
            </div>
          ) : null}

          {!error && !loading && showEmpty ? (
            <p className="mt-5 w-full max-w-[358px] text-[20px] font-medium leading-normal text-[rgba(255,255,255,0.5)]">
              No results for &quot;{committedQ}&quot;
            </p>
          ) : null}

          {!error && !loading && !showEmpty && count > 0 ? (
            <ul className="mt-5 flex w-full flex-col gap-5" aria-label="Search results">
              {results.map((item) => (
                <li key={item.id}>
                  <SearchResultItem item={item} />
                </li>
              ))}
            </ul>
          ) : null}
        </main>

        <BottomNavigation activeItem="discover" />
      </div>
    </div>
  );
}
