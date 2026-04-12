import type { MovieItem } from '@/types/movie';
import type { TabItem } from '@/types/tabs';

/** TMDB poster CDN — w500 (~2:3 theatrical one-sheets) */
const p = (file: string) => `https://image.tmdb.org/t/p/w500/${file}`;

export const recommendedMovies: MovieItem[] = [
  {
    id: 'rec-fc',
    title: 'Fight Club',
    rating: '4.3',
    year: 1999,
    genre: 'Drama',
    posterUrl: p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
    itemSlug: 'fight-club',
  },
  {
    id: 'rec-1',
    title: 'Past Lives',
    rating: '4.2',
    year: 2023,
    genre: 'Drama',
    posterUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'),
    itemSlug: 'past-lives',
  },
  {
    id: 'rec-2',
    title: 'Aftersun',
    rating: '4.1',
    year: 2022,
    genre: 'Drama',
    posterUrl: p('evKz85EKouVbIr51zy5fOtpNRPg.jpg'),
    itemSlug: 'aftersun',
  },
  {
    id: 'rec-3',
    title: 'Portrait of a Lady on Fire',
    rating: '4.4',
    year: 2019,
    genre: 'Romance',
    posterUrl: p('2LquGwEhbg3soxSCs9VNyh5VJd9.jpg'),
    itemSlug: 'portrait-of-a-lady-on-fire',
  },
];

export const becauseYouLikedMovies: MovieItem[] = [
  {
    id: 'byl-1',
    title: 'Burning',
    rating: '4.3',
    year: 2018,
    genre: 'Thriller',
    posterUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg'),
    itemSlug: 'burning',
  },
  {
    id: 'byl-2',
    title: 'Decision to Leave',
    rating: '4.0',
    year: 2022,
    genre: 'Mystery',
    posterUrl: p('cAoAgzOCxSytYBqqCQulhXNR3LB.jpg'),
    itemSlug: 'decision-to-leave',
  },
  {
    id: 'byl-3',
    title: 'Parasite',
    rating: '4.5',
    year: 2019,
    genre: 'Thriller',
    posterUrl: p('7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    itemSlug: 'parasite',
  },
];

export const hiddenGemsMovies: MovieItem[] = [
  {
    id: 'hg-1',
    title: 'Saint Maud',
    rating: '3.9',
    year: 2019,
    genre: 'Horror',
    posterUrl: p('6mPNdmjdbVKPITv3LLCmQoKs9Zw.jpg'),
    itemSlug: 'saint-maud',
  },
  {
    id: 'hg-2',
    title: 'The Rider',
    rating: '4.0',
    year: 2017,
    genre: 'Drama',
    posterUrl: p('2szdEK0Mr0RG0nWGFVTseNQHbnP.jpg'),
    itemSlug: 'the-rider',
  },
  {
    id: 'hg-3',
    title: 'Columbus',
    rating: '3.8',
    year: 2017,
    genre: 'Drama',
    posterUrl: p('sEhC3tuiqIdTCahOf2F99M3aQv7.jpg'),
    itemSlug: 'columbus',
  },
];

export const discoverTabItems: TabItem[] = [
  { id: 'films', label: 'Films' },
  { id: 'series', label: 'Series' },
  { id: 'anime', label: 'Anime' },
  { id: 'books', label: 'Books' },
];

export const tasteInsightContent = {
  description:
    'You often enjoy dark sci-fi stories with psychological themes.',
};
