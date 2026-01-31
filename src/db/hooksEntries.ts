'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Domain } from './db';
import { getItemView } from '@/repos/itemsRepo';
import { makeEntryId } from './entryId';
import { upsertCatalogItems } from '@/repos/catalogRepo';
import { fetchRecommendationsTmdb, fetchTrendingTmdb } from '@/providers/tmdbClient';
import type { ItemView } from '@/types/itemView';

/**
 * Hook to get watched items from entries + catalog.
 * Returns ItemView[] sorted by watchedAt desc (fallback updatedAt).
 */
export function useWatchedItems(domain?: Domain) {
  const itemViews = useLiveQuery(
    async () => {
      // Query entries: filter by status === 'watched'
      let query = db.entries
        .where('status')
        .equals('watched');

      // If domain provided, filter by domain
      if (domain) {
        query = query.filter((entry) => entry.domain === domain);
      }

      const allEntries = await query.toArray();

      // Sort: watchedAt desc (if present), else updatedAt desc
      const sortedEntries = allEntries.sort((a, b) => {
        const aTime = a.watchedAt || a.updatedAt;
        const bTime = b.watchedAt || b.updatedAt;
        return bTime - aTime;
      });

      // Get all ids from sorted entries
      const ids = sortedEntries.map((entry) => entry.id);

      // Fetch ItemView for each id in parallel
      const views = await Promise.all(
        ids.map((id) => getItemView(id))
      );

      // Filter out nulls (shouldn't happen for watched entries, but be safe)
      return views.filter((view): view is ItemView => view !== null);
    },
    [domain],
    []
  );

  return {
    items: itemViews || [],
    loading: itemViews === undefined,
  };
}

/**
 * Convenience hook to get watched film items.
 */
export function useWatchedFilms() {
  return useWatchedItems('film');
}

/**
 * Hook to get queued items from entries + catalog.
 * Returns ItemView[] sorted by queuedAt desc (fallback updatedAt).
 */
export function useQueuedItems(domain?: Domain) {
  const itemViews = useLiveQuery(
    async () => {
      // Query entries: filter by status === 'queued'
      let query = db.entries
        .where('status')
        .equals('queued');

      // If domain provided, filter by domain
      if (domain) {
        query = query.filter((entry) => entry.domain === domain);
      }

      const allEntries = await query.toArray();

      // Sort: queuedAt desc (if present), else updatedAt desc
      const sortedEntries = allEntries.sort((a, b) => {
        const aTime = a.queuedAt || a.updatedAt;
        const bTime = b.queuedAt || b.updatedAt;
        return bTime - aTime;
      });

      // Get all ids from sorted entries
      const ids = sortedEntries.map((entry) => entry.id);

      // Fetch ItemView for each id in parallel
      const views = await Promise.all(
        ids.map((id) => getItemView(id))
      );

      // Filter out nulls
      return views.filter((view): view is ItemView => view !== null);
    },
    [domain],
    []
  );

  return {
    items: itemViews || [],
    loading: itemViews === undefined,
  };
}

/**
 * Convenience hook to get queued film items.
 */
export function useQueuedFilms() {
  return useQueuedItems('film');
}

/**
 * Hook to get the count of TasteSeed records.
 */
export function useTasteSeedCount(): number {
  const count = useLiveQuery(
    async () => {
      return db.tasteSeeds.count();
    },
    [],
    0
  );

  return count ?? 0;
}

// Anti-spam guard: track which seeds we've fetched recommendations for in this session
const fetchedSeedIds = new Set<string>();
// Anti-spam guard: track which domains we've fetched trending for in this session
const fetchedTrendingDomains = new Set<string>();

type LifePickResult = {
  safePick: ItemView | null;
  wildcard: ItemView | null;
  reasons: { safe: string; wildcard: string };
  debug?: string;
};

/**
 * Hook to get life recommendations (safe pick + wildcard) based on taste seeds.
 * Always returns LifePickResult (never null).
 */
export function useLifePick(): LifePickResult {
  const pick = useLiveQuery(
    async () => {
      let stage = 'start';
      let lastError: string | null = null;

      // 1) Load TasteSeeds + seed items
      const tasteSeeds = await db.tasteSeeds.orderBy('weight').reverse().toArray();
      stage = 'loaded seeds';
      
      if (tasteSeeds.length === 0) {
        return {
          safePick: null,
          wildcard: null,
          reasons: { safe: '', wildcard: '' },
          debug: `stage=${stage} | no taste seeds`,
        };
      }

      const topSeed = tasteSeeds[0];
      const topSeedItemView = await getItemView(topSeed.entryId);
      
      if (!topSeedItemView) {
        return {
          safePick: null,
          wildcard: null,
          reasons: { safe: '', wildcard: '' },
          debug: `stage=${stage} | no valid seed item`,
        };
      }

      const secondSeed = tasteSeeds.length > 1 ? tasteSeeds[1] : null;
      const secondSeedItemView = secondSeed ? await getItemView(secondSeed.entryId) : null;

      // 2) Build excludedIds from db.entries
      const allEntries = await db.entries.toArray();
      const excludedIds = new Set(allEntries.map((e) => e.id));

      // Helper to build ItemView from catalog item
      const buildItemView = (catalogItem: Awaited<ReturnType<typeof db.catalog.toArray>>[0]): ItemView => ({
        id: catalogItem.id,
        domain: catalogItem.domain,
        title: catalogItem.title,
        year: catalogItem.year,
        overview: catalogItem.overview,
        posterUrl: catalogItem.posterUrl,
        backdropUrl: catalogItem.backdropUrl,
        genres: catalogItem.genres,
        entry: undefined,
      });

      // Helper to check if candidate is valid (not in entries, same domain)
      const isValidCandidate = (catalogItem: Awaited<ReturnType<typeof db.catalog.toArray>>[0], seedDomain: Domain) => {
        if (excludedIds.has(catalogItem.id)) {
          return false;
        }
        if (catalogItem.domain !== seedDomain) {
          return false;
        }
        return true;
      };

      // Helper to find safe pick and wildcard from catalog
      const findCandidates = (catalog: Awaited<ReturnType<typeof db.catalog.toArray>>) => {
        const topSeedGenres = new Set(topSeedItemView.genres);
        let safePick: ItemView | null = null;
        let wildcard: ItemView | null = null;
        let candidateCount = 0;
        const candidates: ItemView[] = [];

        // Find safe pick: first candidate sharing >=1 genre with top TasteSeed
        for (const catalogItem of catalog) {
          if (!isValidCandidate(catalogItem, topSeedItemView.domain)) {
            continue;
          }
          candidateCount++;
          const itemView = buildItemView(catalogItem);
          candidates.push(itemView);
          
          const hasSharedGenre = catalogItem.genres.some((g) => topSeedGenres.has(g));
          if (hasSharedGenre) {
            safePick = itemView;
            break;
          }
        }

        // Find wildcard: first candidate that does NOT share genre with top TasteSeed
        for (const catalogItem of catalog) {
          if (!isValidCandidate(catalogItem, topSeedItemView.domain)) {
            continue;
          }
          
          if (safePick && catalogItem.id === safePick.id) {
            continue;
          }
          
          const hasSharedGenre = catalogItem.genres.some((g) => topSeedGenres.has(g));
          if (!hasSharedGenre) {
            wildcard = buildItemView(catalogItem);
            break;
          }
        }

        // Fallback: if no wildcard found, try second TasteSeed
        if (!wildcard && secondSeedItemView) {
          for (const catalogItem of catalog) {
            if (!isValidCandidate(catalogItem, secondSeedItemView.domain)) {
              continue;
            }
            
            if (safePick && catalogItem.id === safePick.id) {
              continue;
            }
            
            wildcard = buildItemView(catalogItem);
            break;
          }
        }

        return { safePick, wildcard, candidateCount, candidates };
      };

      // 3) Attempt to find candidates in db.catalog excluding excludedIds
      stage = 'catalog scan';
      let allCatalog = await db.catalog.toArray();
      let result = findCandidates(allCatalog);
      let { safePick, wildcard } = result;
      const initialCandidateCount = result.candidateCount;
      let isGuaranteePick = false;

      // FINAL GUARANTEE PICK
      if (!safePick && result.candidates.length > 0) {
        safePick = result.candidates[0];
        isGuaranteePick = true;
      }

      // 4) If candidates list is empty, fetch TMDB recommendations
      if (!safePick && !fetchedSeedIds.has(topSeed.entryId)) {
        stage = 'fetch recos';

        // Extract sourceId from entryId (format: tmdb:domain:sourceId)
        const parts = topSeedItemView.id.split(':');
        if (parts.length === 3 && parts[0] === 'tmdb') {
          const sourceId = parts[2];
          const domain = topSeedItemView.domain;

          try {
            // Fetch recommendations from TMDB
            const recommendations = await fetchRecommendationsTmdb(sourceId, domain);
            stage = 'reco upserted';

            // Upsert recommendations into catalog
            const catalogItems = recommendations.map((reco) => ({
              id: makeEntryId('tmdb', reco.domain, String(reco.sourceId)),
              source: 'tmdb' as const,
              sourceId: String(reco.sourceId),
              domain: reco.domain,
              title: reco.title,
              year: reco.year,
              overview: reco.overview,
              posterUrl: reco.posterUrl,
              backdropUrl: reco.backdropUrl,
              genres: reco.genres,
              voteAverage: reco.voteAverage,
            }));

            await upsertCatalogItems(catalogItems);

            // Mark this seed as fetched (anti-spam guard)
            fetchedSeedIds.add(topSeed.entryId);

            // Re-query catalog and rebuild candidates
            stage = 'catalog rescan after recos';
            allCatalog = await db.catalog.toArray();
            result = findCandidates(allCatalog);
            safePick = result.safePick;
            wildcard = result.wildcard;

            // FINAL GUARANTEE PICK
            if (!safePick && result.candidates.length > 0) {
              safePick = result.candidates[0];
              isGuaranteePick = true;
            }
          } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
            console.error(`Error fetching recommendations for ${topSeed.entryId}:`, error);
          }
        }
      }

      // Return results if we have at least safe pick
      if (safePick) {
        stage = 'picked safe';
        return {
          safePick,
          wildcard,
          reasons: {
            safe: isGuaranteePick 
              ? 'General pick from your catalog'
              : `Because you liked ${topSeedItemView.title}`,
            wildcard: 'A different direction from your usual picks',
          },
        };
      }

      // 5) Fallback: if still no candidates after recommendations, fetch trending
      if (!safePick && !fetchedTrendingDomains.has(topSeedItemView.domain)) {
        stage = 'fetch trending';

        try {
          // Fetch trending items from TMDB
          const trending = await fetchTrendingTmdb(topSeedItemView.domain);
          stage = 'trending upserted';

          // Upsert trending items into catalog
          const catalogItems = trending.map((item) => ({
            id: makeEntryId('tmdb', item.domain, String(item.sourceId)),
            source: 'tmdb' as const,
            sourceId: String(item.sourceId),
            domain: item.domain,
            title: item.title,
            year: item.year,
            overview: item.overview,
            posterUrl: item.posterUrl,
            backdropUrl: item.backdropUrl,
            genres: item.genres,
            voteAverage: item.voteAverage,
          }));

          await upsertCatalogItems(catalogItems);

          // Mark this domain as fetched (anti-spam guard)
          fetchedTrendingDomains.add(topSeedItemView.domain);

          // Re-query catalog and rebuild candidates
          stage = 'catalog rescan after trending';
          allCatalog = await db.catalog.toArray();
          result = findCandidates(allCatalog);
          safePick = result.safePick;
          wildcard = result.wildcard;

          // FINAL GUARANTEE PICK
          if (!safePick && result.candidates.length > 0) {
            safePick = result.candidates[0];
            isGuaranteePick = true;
          }

          // If we found a candidate from trending, return with trending reason
          if (safePick) {
            stage = 'picked safe';
            return {
              safePick,
              wildcard,
              reasons: {
                safe: isGuaranteePick
                  ? 'General pick from your catalog'
                  : 'Trending pick (no matches from your taste yet)',
                wildcard: 'A different direction from your usual picks',
              },
            };
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error);
          console.error(`Error fetching trending for ${topSeedItemView.domain}:`, error);
        }
      }

      // Still no candidates after fetch
      stage = 'picked none';
      // Re-run findCandidates to get latest candidate count
      const finalResult = findCandidates(allCatalog);
      const debugParts = [`stage=${stage}`];
      if (lastError) {
        debugParts.push(`error=${lastError}`);
      }
      debugParts.push(`candidates=${finalResult.candidateCount}`);
      debugParts.push(`excluded=${excludedIds.size}`);
      debugParts.push(`catalog=${allCatalog.length}`);
      
      return {
        safePick: null,
        wildcard: null,
        reasons: { safe: '', wildcard: '' },
        debug: debugParts.join(' | '),
      };
    },
    [],
    {
      safePick: null,
      wildcard: null,
      reasons: { safe: '', wildcard: '' },
      debug: 'loading',
    }
  );

  return pick;
}
