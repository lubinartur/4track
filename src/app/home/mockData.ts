import type { HomeHeroContent } from '@/types/homeHero';
import type { ItemDetail } from '@/types/item';
import type { MovieItem } from '@/types/movie';
import { itemDetailsById } from '@/app/item/itemData';
import { recommendedMovies } from '@/app/discover/mockData';

/** Maps item mock data to the home hero card shape (single source for linked titles). */
function itemToHeroContent(item: ItemDetail, slideId: string): HomeHeroContent {
  return {
    id: slideId,
    title: item.title,
    posterUrl: item.posterUrl,
    rating: item.rating,
    year: item.year,
    genresLabel: item.genresLabel,
    aiMatchPercent: item.heroAiMatchPercent,
    reasonTags: item.heroReasonTags,
    tasteInsight: {
      entryCount: item.tasteInsight.entryCount,
      description: item.tasteInsight.description,
    },
    itemSlug: item.id,
  };
}

/** Hero rail — each slide pulls from `itemData` so hero + ItemPage stay aligned. */
export const homeHeroSlides: HomeHeroContent[] = [
  itemToHeroContent(itemDetailsById['past-lives'], 'hero-peek-past-lives'),
  itemToHeroContent(itemDetailsById['fight-club'], 'home-hero'),
  itemToHeroContent(itemDetailsById.aftersun, 'hero-peek-aftersun'),
];

/** Featured center slide — same data as `homeHeroSlides[1]` */
export const homeHeroContent = itemToHeroContent(itemDetailsById['fight-club'], 'home-hero');

export const homeRecommended: MovieItem[] = recommendedMovies;
