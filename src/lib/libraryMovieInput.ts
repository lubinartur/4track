import type { LibraryEntry } from '@/app/library/mockData';
import type { DiscoverSearchResultItem } from '@/types/discoverSearch';
import type { HomeHeroContent } from '@/types/homeHero';
import type { ItemDetail } from '@/types/item';

/** Payload passed into the library store (deduped by `key`). */
export type LibraryMovieInput = {
  key: string;
  title: string;
  rating: string;
  year: number;
  genresLabel: string;
  posterUrl: string;
  itemSlug?: string;
};

export function libraryInputFromItemDetail(item: ItemDetail): LibraryMovieInput {
  return {
    key: item.id,
    title: item.title,
    rating: item.rating,
    year: item.year,
    genresLabel: item.genresLabel,
    posterUrl: item.posterUrl,
    itemSlug: item.id.startsWith('tmdb-') ? undefined : item.id,
  };
}

export function libraryInputFromSearchResult(item: DiscoverSearchResultItem): LibraryMovieInput | null {
  const key = item.itemSlug ?? (item.id.startsWith('tmdb-') ? item.id : null);
  if (!key) return null;
  return {
    key,
    title: item.title,
    rating: item.rating,
    year: item.year,
    genresLabel: item.genresLabel,
    posterUrl: item.posterUrl,
    itemSlug: item.itemSlug,
  };
}

export function libraryInputFromHomeHero(hero: HomeHeroContent): LibraryMovieInput | null {
  if (!hero.itemSlug) return null;
  return {
    key: hero.itemSlug,
    title: hero.title,
    rating: hero.rating,
    year: hero.year,
    genresLabel: hero.genresLabel,
    posterUrl: hero.posterUrl,
    itemSlug: hero.itemSlug,
  };
}

export function libraryInputFromEntry(entry: LibraryEntry): LibraryMovieInput {
  const key = entry.itemSlug ?? entry.id;
  return {
    key,
    title: entry.title,
    rating: entry.rating,
    year: entry.year,
    genresLabel: entry.genresLabel,
    posterUrl: entry.posterUrl,
    itemSlug: entry.itemSlug,
  };
}
